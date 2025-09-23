import {
  Check,
  defined,
  DeveloperError,
  Frozen,
  Math as CesiumMath,
  RuntimeError,
} from "@cesium/engine";

import DistanceUnits from "./DistanceUnits.js";
import AreaUnits from "./AreaUnits.js";
import VolumeUnits from "./VolumeUnits.js";
import AngleUnits from "./AngleUnits.js";

/**
 * Units of measure used for the measure widget.
 *
 * @param {Object} options Object with the following properties:
 * @param {DistanceUnits} [options.distanceUnits=DistanceUnits.METERS] Distance units.
 * @param {AreaUnits} [options.areaUnits=AreaUnits.SQUARE_METERS] The base unit for area.
 * @param {VolumeUnits} [options.volumeUnits=VolumeUnits.CUBIC_METERS] The base unit for volume.
 * @param {AngleUnits} [options.angleUnits=AngleUnits.DEGREES] Angle units.
 * @param {AngleUnits} [options.slopeUnits=AngleUnits.DEGREES] Slope units.
 *
 * @alias MeasureUnits
 * @constructor
 * @ionsdk
 */
function MeasureUnits(options) {
  options = options ?? Frozen.EMPTY_OBJECT;
  this.distanceUnits = options.distanceUnits ?? DistanceUnits.METERS;
  this.areaUnits = options.areaUnits ?? AreaUnits.SQUARE_METERS;
  this.volumeUnits = options.volumeUnits ?? VolumeUnits.CUBIC_METERS;
  this.angleUnits = options.angleUnits ?? AngleUnits.DEGREES;
  this.slopeUnits = options.slopeUnits ?? AngleUnits.DEGREES;
}

/**
 * @private
 */
MeasureUnits.convertDistance = function (distance, from, to) {
  if (from === to) {
    return distance;
  }
  const toMeters = getDistanceUnitConversion(from);
  const fromMeters = 1.0 / getDistanceUnitConversion(to);
  return distance * toMeters * fromMeters;
};

/**
 * @private
 */
MeasureUnits.convertArea = function (area, from, to) {
  if (from === to) {
    return area;
  }
  const toMeters = getAreaUnitConversion(from);
  const fromMeters = 1.0 / getAreaUnitConversion(to);
  return area * toMeters * fromMeters;
};

/**
 * @private
 */
MeasureUnits.convertVolume = function (volume, from, to) {
  if (from === to) {
    return volume;
  }
  const toMeters = getVolumeUnitConversion(from);
  const fromMeters = 1.0 / getVolumeUnitConversion(to);
  return volume * toMeters * fromMeters;
};

/**
 * @private
 */
MeasureUnits.convertAngle = function (angle, from, to) {
  if (from === to) {
    return angle;
  }
  const radians = convertAngleToRadians(angle, from);
  return convertAngleFromRadians(radians, to);
};

/**
 * @private
 */
MeasureUnits.numberToString = function (number, selectedLocale, options) {
  return numberToFormattedString(number, selectedLocale, options);
};

/**
 * @private
 */
MeasureUnits.distanceToString = function (
  meters,
  distanceUnits,
  selectedLocale,
  options,
) {
  const distance = MeasureUnits.convertDistance(
    meters,
    DistanceUnits.METERS,
    distanceUnits,
  );
  return (
    numberToFormattedString(distance, selectedLocale, options) +
    MeasureUnits.getDistanceUnitSpacing(distanceUnits) +
    MeasureUnits.getDistanceUnitSymbol(distanceUnits)
  );
};

/**
 * @private
 */
MeasureUnits.areaToString = function (
  metersSquared,
  areaUnits,
  selectedLocale,
  options,
) {
  const area = MeasureUnits.convertArea(
    metersSquared,
    AreaUnits.SQUARE_METERS,
    areaUnits,
  );
  return (
    numberToFormattedString(area, selectedLocale, options) +
    MeasureUnits.getAreaUnitSpacing(areaUnits) +
    MeasureUnits.getAreaUnitSymbol(areaUnits)
  );
};

/**
 * @private
 */
MeasureUnits.volumeToString = function (
  metersCubed,
  volumeUnits,
  selectedLocale,
  options,
) {
  const volume = MeasureUnits.convertVolume(
    metersCubed,
    VolumeUnits.CUBIC_METERS,
    volumeUnits,
  );
  return (
    numberToFormattedString(volume, selectedLocale, options) +
    MeasureUnits.getVolumeUnitSpacing(volumeUnits) +
    MeasureUnits.getVolumeUnitSymbol(volumeUnits)
  );
};

/**
 * @private
 */
MeasureUnits.angleToString = function (
  angleRadians,
  angleUnits,
  selectedLocale,
  options,
) {
  if (
    angleUnits === AngleUnits.DEGREES ||
    angleUnits === AngleUnits.RADIANS ||
    angleUnits === AngleUnits.GRADE
  ) {
    const angle = convertAngleFromRadians(angleRadians, angleUnits);
    return (
      numberToFormattedString(angle, selectedLocale, options) +
      MeasureUnits.getAngleUnitSpacing(angleUnits) +
      MeasureUnits.getAngleUnitSymbol(angleUnits)
    );
  } else if (angleUnits === AngleUnits.DEGREES_MINUTES_SECONDS) {
    let deg = CesiumMath.toDegrees(angleRadians);
    const sign = deg < 0 ? "-" : "";
    deg = Math.abs(deg);
    const d = Math.floor(deg);
    const minfloat = (deg - d) * 60;
    const m = Math.floor(minfloat);
    let s = (minfloat - m) * 60;
    s = numberToFormattedString(s, undefined, options); // The locale is undefined so that a period is used instead of a comma for the decimal
    return `${sign + d}° ${m}' ${s}"`;
  } else if (angleUnits === AngleUnits.RATIO) {
    const riseOverRun = convertAngleFromRadians(angleRadians, angleUnits);
    const run = 1.0 / riseOverRun;
    const localeStringOptions = getLocaleFormatStringOptions(options);
    localeStringOptions.minimumFractionDigits = 0;
    return `1:${numberToFormattedString(
      run,
      selectedLocale,
      localeStringOptions,
    )}`;
  }
};

/**
 * @private
 */
MeasureUnits.longitudeToString = function (
  longitude,
  angleUnits,
  selectedLocale,
  options,
) {
  return `${MeasureUnits.angleToString(
    Math.abs(longitude),
    angleUnits,
    selectedLocale,
    options,
  )} ${longitude < 0.0 ? "W" : "E"}`;
};

/**
 * @private
 */
MeasureUnits.latitudeToString = function (
  latitude,
  angleUnits,
  selectedLocale,
  options,
) {
  return `${MeasureUnits.angleToString(
    Math.abs(latitude),
    angleUnits,
    selectedLocale,
    options,
  )} ${latitude < 0.0 ? "S" : "N"}`;
};

/**
 * @private
 */
MeasureUnits.getDistanceUnitSymbol = function (distanceUnits) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("distanceUnits", distanceUnits);
  //>>includeEnd('debug');

  if (distanceUnits === DistanceUnits.METERS) {
    return "m";
  } else if (distanceUnits === DistanceUnits.CENTIMETERS) {
    return "cm";
  } else if (distanceUnits === DistanceUnits.KILOMETERS) {
    return "km";
  } else if (
    distanceUnits === DistanceUnits.FEET ||
    distanceUnits === DistanceUnits.US_SURVEY_FEET
  ) {
    return "ft";
  } else if (distanceUnits === DistanceUnits.INCHES) {
    return "in";
  } else if (distanceUnits === DistanceUnits.YARDS) {
    return "yd";
  } else if (distanceUnits === DistanceUnits.MILES) {
    return "mi";
  }
  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid distance units: ${distanceUnits}`);
  //>>includeEnd('debug');
};

MeasureUnits.getDistanceUnitSpacing = function (distanceUnits) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("distanceUnits", distanceUnits);
  //>>includeEnd('debug');

  return " ";
};

/**
 * @private
 */
MeasureUnits.getAreaUnitSymbol = function (areaUnits) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("areaUnits", areaUnits);
  //>>includeEnd('debug');

  if (areaUnits === AreaUnits.SQUARE_METERS) {
    return "m²";
  } else if (areaUnits === AreaUnits.SQUARE_CENTIMETERS) {
    return "cm²";
  } else if (areaUnits === AreaUnits.SQUARE_KILOMETERS) {
    return "km²";
  } else if (areaUnits === AreaUnits.SQUARE_FEET) {
    return "sq ft";
  } else if (areaUnits === AreaUnits.SQUARE_INCHES) {
    return "sq in";
  } else if (areaUnits === AreaUnits.SQUARE_YARDS) {
    return "sq yd";
  } else if (areaUnits === AreaUnits.SQUARE_MILES) {
    return "sq mi";
  } else if (areaUnits === AreaUnits.ACRES) {
    return "ac";
  } else if (areaUnits === AreaUnits.HECTARES) {
    return "ha";
  }
  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid area units: ${areaUnits}`);
  //>>includeEnd('debug');
};

/**
 * @private
 */
MeasureUnits.getAreaUnitSpacing = function (areaUnits) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("areaUnits", areaUnits);
  //>>includeEnd('debug');

  return " ";
};

/**
 * @private
 */
MeasureUnits.getVolumeUnitSymbol = function (volumeUnits) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("volumeUnits", volumeUnits);
  //>>includeEnd('debug');

  if (volumeUnits === VolumeUnits.CUBIC_METERS) {
    return "m³";
  } else if (volumeUnits === VolumeUnits.CUBIC_CENTIMETERS) {
    return "cm³";
  } else if (volumeUnits === VolumeUnits.CUBIC_KILOMETERS) {
    return "km³";
  } else if (volumeUnits === VolumeUnits.CUBIC_FEET) {
    return "cu ft";
  } else if (volumeUnits === VolumeUnits.CUBIC_INCHES) {
    return "cu in";
  } else if (volumeUnits === VolumeUnits.CUBIC_YARDS) {
    return "cu yd";
  } else if (volumeUnits === VolumeUnits.CUBIC_MILES) {
    return "cu mi";
  }
  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid volume units: ${volumeUnits}`);
  //>>includeEnd('debug');
};

/**
 * @private
 */
MeasureUnits.getVolumeUnitSpacing = function (volumeUnits) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("volumeUnits", volumeUnits);
  //>>includeEnd('debug');

  return " ";
};

/**
 * @private
 */
MeasureUnits.getAngleUnitSymbol = function (angleUnits) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("angleUnits", angleUnits);
  //>>includeEnd('debug');

  if (angleUnits === AngleUnits.DEGREES) {
    return "°";
  } else if (angleUnits === AngleUnits.RADIANS) {
    return "rad";
  } else if (angleUnits === AngleUnits.GRADE) {
    return "%";
  }
  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid angle units: ${angleUnits}`);
  //>>includeEnd('debug');
};

/**
 * @private
 */
MeasureUnits.getAngleUnitSpacing = function (angleUnits) {
  //>>includeStart('debug', pragmas.debug);
  Check.typeOf.string("angleUnits", angleUnits);
  //>>includeEnd('debug');

  if (angleUnits === AngleUnits.RADIANS) {
    return " ";
  }
  return "";
};

function getLocaleFormatStringOptions(options, number, selectedLocale) {
  options = options ?? 2;
  let localeStringOptions = {};
  if ("number" === typeof options) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.number.greaterThanOrEquals("options", options, 0);
    //>>includeEnd('debug');
    localeStringOptions.maximumFractionDigits =
      localeStringOptions.minimumFractionDigits = options;
  } else if ("function" === typeof options) {
    localeStringOptions = options(number, selectedLocale);
  } else {
    localeStringOptions = options;
  }
  return localeStringOptions;
}

const negativeZero = -0.0;
const positiveZero = 0.0;

/**
 * @callback formatOptionsFunction
 * @param {Number} number Value after unit conversion
 * @param {String} locale Locale to use for formatting
 * @return {Object} Options object to pass to `{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString|Number.toLocaleString}`
 */

/**
 * @param {Number} number
 * @param {String} selectedLocale Locale to use for formatting
 * @param {Number|Object|formatOptionFunction} options One of :
 *  * Number of digits after the decimal seperator to include
 *  * Options object to pass to `{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString|Number.toLocaleString}`
 *  * A function that returns an options object to pass to `Number.toLocaleString`
 * @private
 */
function numberToFormattedString(number, selectedLocale, options) {
  const localeStringOptions = getLocaleFormatStringOptions(
    options,
    number,
    selectedLocale,
  );

  // If locale is undefined, the runtime's default locale is used.
  const numberString = number.toLocaleString(
    selectedLocale,
    localeStringOptions,
  );
  const negativeZeroString = negativeZero.toLocaleString(
    selectedLocale,
    localeStringOptions,
  );
  if (numberString === negativeZeroString) {
    return positiveZero.toLocaleString(selectedLocale, localeStringOptions);
  }
  return numberString;
}

function getDistanceUnitConversion(distanceUnits) {
  if (distanceUnits === DistanceUnits.METERS) {
    return 1.0;
  } else if (distanceUnits === DistanceUnits.CENTIMETERS) {
    return 0.01;
  } else if (distanceUnits === DistanceUnits.KILOMETERS) {
    return 1000.0;
  } else if (distanceUnits === DistanceUnits.FEET) {
    return 0.3048;
  } else if (distanceUnits === DistanceUnits.US_SURVEY_FEET) {
    return 1200.0 / 3937.0;
  } else if (distanceUnits === DistanceUnits.INCHES) {
    return 0.0254;
  } else if (distanceUnits === DistanceUnits.YARDS) {
    return 0.9144;
  } else if (distanceUnits === DistanceUnits.MILES) {
    return 1609.344;
  }
  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid distance units:${distanceUnits}`);
  //>>includeEnd('debug');
}

function getAreaUnitConversion(areaUnits) {
  if (areaUnits === AreaUnits.SQUARE_METERS) {
    return 1.0;
  } else if (areaUnits === AreaUnits.SQUARE_CENTIMETERS) {
    return 0.0001;
  } else if (areaUnits === AreaUnits.SQUARE_KILOMETERS) {
    return 1000000.0;
  } else if (areaUnits === AreaUnits.SQUARE_FEET) {
    return 0.3048 * 0.3048;
  } else if (areaUnits === AreaUnits.SQUARE_INCHES) {
    return 0.0254 * 0.0254;
  } else if (areaUnits === AreaUnits.SQUARE_YARDS) {
    return 0.9144 * 0.9144;
  } else if (areaUnits === AreaUnits.SQUARE_MILES) {
    return 1609.344 * 1609.344;
  } else if (areaUnits === AreaUnits.ACRES) {
    return 4046.85642232;
  } else if (areaUnits === AreaUnits.HECTARES) {
    return 10000.0;
  }
  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid area units:${areaUnits}`);
  //>>includeEnd('debug');
}

function getVolumeUnitConversion(volumeUnits) {
  if (volumeUnits === VolumeUnits.CUBIC_METERS) {
    return 1.0;
  } else if (volumeUnits === VolumeUnits.CUBIC_CENTIMETERS) {
    return 0.000001;
  } else if (volumeUnits === VolumeUnits.CUBIC_KILOMETERS) {
    return 1000000000.0;
  } else if (volumeUnits === VolumeUnits.CUBIC_FEET) {
    return 0.3048 * 0.3048 * 0.3048;
  } else if (volumeUnits === VolumeUnits.CUBIC_INCHES) {
    return 0.0254 * 0.0254 * 0.0254;
  } else if (volumeUnits === VolumeUnits.CUBIC_YARDS) {
    return 0.9144 * 0.9144 * 0.9144;
  } else if (volumeUnits === VolumeUnits.CUBIC_MILES) {
    return 1609.344 * 1609.344 * 1609.344;
  }
  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid volume units:${volumeUnits}`);
  //>>includeEnd('debug');
}

const degreesMinutesSecondsRegex =
  /(-?)(\d+)\s*°\s*(\d+)\s*'\s*([\d.,]+)"\s*([WENS]?)/i;

function convertAngleToRadians(value, angleUnits) {
  if (angleUnits === AngleUnits.RADIANS) {
    return value;
  } else if (angleUnits === AngleUnits.DEGREES) {
    return CesiumMath.toRadians(value);
  } else if (angleUnits === AngleUnits.GRADE) {
    if (value === Number.POSITIVE_INFINITY) {
      return CesiumMath.PI_OVER_TWO;
    }
    return Math.atan(value / 100.0);
  } else if (angleUnits === AngleUnits.RATIO) {
    // Converts to radians where value is rise/run
    return Math.atan(value);
  } else if (angleUnits === AngleUnits.DEGREES_MINUTES_SECONDS) {
    const matches = degreesMinutesSecondsRegex.exec(value);
    if (!defined(matches)) {
      throw new RuntimeError(`Could not convert angle to radians: ${value}`);
    }
    let sign = matches[1].length > 0 ? -1.0 : 1.0;
    const degrees = parseInt(matches[2]);
    const minutes = parseInt(matches[3]);
    const seconds = parseFloat(matches[4]);
    let cardinal = matches[5];

    if (cardinal.length === 1) {
      cardinal = cardinal.toUpperCase();
      if (cardinal === "W" || cardinal === "S") {
        sign *= -1.0;
      }
    }

    const degreesDecimal = sign * (degrees + minutes / 60.0 + seconds / 3600.0);
    return CesiumMath.toRadians(degreesDecimal);
  }

  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid angle units: ${angleUnits}`);
  //>>includeEnd('debug');
}

function convertAngleFromRadians(value, angleUnits) {
  if (angleUnits === AngleUnits.RADIANS) {
    return value;
  } else if (angleUnits === AngleUnits.DEGREES) {
    return CesiumMath.toDegrees(value);
  } else if (angleUnits === AngleUnits.GRADE) {
    value = CesiumMath.clamp(Math.abs(value), 0.0, CesiumMath.PI_OVER_TWO);
    if (value === CesiumMath.PI_OVER_TWO) {
      return Number.POSITIVE_INFINITY;
    }
    return 100.0 * Math.tan(value);
  } else if (angleUnits === AngleUnits.RATIO) {
    const rise = Math.sin(value);
    const run = Math.cos(value);
    return rise / run;
  }
  //>>includeStart('debug', pragmas.debug);
  throw new DeveloperError(`Invalid angle units: ${angleUnits}`);
  //>>includeEnd('debug');
}
export default MeasureUnits;

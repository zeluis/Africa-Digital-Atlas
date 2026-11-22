import * as v from 'valibot';

/**
 * Lightweight tree-shaken Valibot schemas for external multilateral & reference API feeds.
 * Ensures malformed or breaking upstream payloads fail gracefully to cached/curated baselines.
 */

export const OpenMeteoForecastSchema = v.object({
  current: v.object({
    temperature_2m: v.number(),
    relative_humidity_2m: v.optional(v.nullable(v.number())),
    apparent_temperature: v.optional(v.nullable(v.number())),
    is_day: v.optional(v.nullable(v.number())),
    precipitation: v.optional(v.nullable(v.number())),
    weather_code: v.optional(v.nullable(v.number())),
    wind_speed_10m: v.optional(v.nullable(v.number())),
    wind_direction_10m: v.optional(v.nullable(v.number())),
  }),
});

export const WikipediaSummarySchema = v.object({
  title: v.string(),
  displaytitle: v.optional(v.string()),
  description: v.optional(v.string()),
  extract: v.optional(v.string(), ''),
  extract_html: v.optional(v.string()),
  thumbnail: v.optional(
    v.object({
      source: v.string(),
      width: v.number(),
      height: v.number(),
    })
  ),
  originalimage: v.optional(
    v.object({
      source: v.string(),
      width: v.number(),
      height: v.number(),
    })
  ),
  content_urls: v.optional(
    v.object({
      desktop: v.optional(
        v.object({
          page: v.string(),
        })
      ),
    })
  ),
});

const CrossrefAuthorSchema = v.object({
  given: v.optional(v.string()),
  family: v.optional(v.string()),
  name: v.optional(v.string()),
});

const CrossrefDatePartsSchema = v.object({
  'date-parts': v.optional(v.array(v.array(v.nullable(v.number())))),
});

export const CrossrefMessageItemSchema = v.object({
  DOI: v.optional(v.string()),
  title: v.optional(v.union([v.string(), v.array(v.string())])),
  subtitle: v.optional(v.array(v.string())),
  'container-title': v.optional(v.union([v.string(), v.array(v.string())])),
  author: v.optional(v.array(CrossrefAuthorSchema)),
  'published-print': v.optional(CrossrefDatePartsSchema),
  'published-online': v.optional(CrossrefDatePartsSchema),
  issued: v.optional(CrossrefDatePartsSchema),
  URL: v.optional(v.string()),
  type: v.optional(v.string()),
  publisher: v.optional(v.string()),
  'is-referenced-by-count': v.optional(v.number()),
});

export const CrossrefWorkResponseSchema = v.object({
  message: CrossrefMessageItemSchema,
});

export const CrossrefSearchResponseSchema = v.object({
  message: v.object({
    items: v.optional(v.array(CrossrefMessageItemSchema), []),
  }),
});

export function parseOpenMeteoResponse(payload: unknown) {
  return v.safeParse(OpenMeteoForecastSchema, payload);
}

export function parseWikipediaSummaryResponse(payload: unknown) {
  return v.safeParse(WikipediaSummarySchema, payload);
}

export function parseCrossrefWorkResponse(payload: unknown) {
  return v.safeParse(CrossrefWorkResponseSchema, payload);
}

export function parseCrossrefSearchResponse(payload: unknown) {
  return v.safeParse(CrossrefSearchResponseSchema, payload);
}

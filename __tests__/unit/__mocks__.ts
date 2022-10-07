import { Choice, NewChoice, PlaceDetails, PlaceDetailsResponse } from '@types'

export const choiceId = 'abc123'

export const place1: PlaceDetails = {
  formattedAddress: '225 S 9th St, Columbia, MO 65201, USA',
  formattedPhoneNumber: '(573) 449-2454',
  internationalPhoneNumber: '+1 573-449-2454',
  name: "Shakespeare's Pizza - Downtown",
  openHours: [
    'Monday: 11:00 AM – 10:00 PM',
    'Tuesday: 11:00 AM – 10:00 PM',
    'Wednesday: 11:00 AM – 10:00 PM',
    'Thursday: 11:00 AM – 10:00 PM',
    'Friday: 11:00 AM – 11:00 PM',
    'Saturday: 11:00 AM – 11:00 PM',
    'Sunday: 11:00 AM – 10:00 PM',
  ],
  photos: ['a-picture-stream'],
  placeId: 'ChIJk8cmpsa33IcRbKLpDn3le4g',
  priceLevel: 2,
  rating: 4.6,
  ratingsTotal: 2060,
  vicinity: '225 South 9th Street, Columbia',
  website: 'http://www.shakespeares.com/',
}

export const place2: PlaceDetails = {
  formattedAddress: '225 S 9th St, Columbia, MO 65201, USA',
  formattedPhoneNumber: '(573) 449-2454',
  internationalPhoneNumber: '+1 573-449-2454',
  name: 'China Moon Restaurant',
  openHours: [
    'Monday: 11:00 AM – 10:00 PM',
    'Tuesday: 11:00 AM – 10:00 PM',
    'Wednesday: 11:00 AM – 10:00 PM',
    'Thursday: 11:00 AM – 10:00 PM',
    'Friday: 11:00 AM – 11:00 PM',
    'Saturday: 11:00 AM – 11:00 PM',
    'Sunday: 11:00 AM – 10:00 PM',
  ],
  photos: ['a-picture-stream'],
  placeId: 'ChIJiTfsP_vJ3IcRs74EWg563vY',
  priceLevel: 1,
  rating: 4.2,
  ratingsTotal: 296,
  vicinity: '3890 Rangeline Street, Columbia',
  website: 'http://www.shakespeares.com/',
}

export const choice: Choice = {
  address: '90210',
  choices: [place1, place2],
  expiration: 1728547851,
  latLng: {
    lat: 39.0013395,
    lng: -92.3128326,
  },
  maxPrice: 4,
  minPrice: 2,
  nextPageToken:
    'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
  openNow: true,
  pagesPerRound: 2,
  radius: 50_000,
  rankBy: 'prominence',
  type: 'restaurant',
}

export const newChoice: NewChoice = {
  address: '90210',
  maxPrice: 4,
  minPrice: 2,
  rankBy: 'distance',
  type: 'restaurant',
}

export const geocodeResult = {
  data: {
    results: [
      {
        address_components: [
          {
            long_name: '65202',
            short_name: '65202',
            types: ['postal_code'],
          },
          {
            long_name: 'Columbia',
            short_name: 'Columbia',
            types: ['locality', 'political'],
          },
          {
            long_name: 'Missouri',
            short_name: 'MO',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'United States',
            short_name: 'US',
            types: ['country', 'political'],
          },
        ],
        formatted_address: '90210',
        geometry: {
          bounds: {
            northeast: {
              lat: 39.1343699,
              lng: -92.0693709,
            },
            southwest: {
              lat: 38.86871,
              lng: -92.49803009999999,
            },
          },
          location: {
            lat: 39.0013395,
            lng: -92.31283259999999,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 39.1343699,
              lng: -92.0693709,
            },
            southwest: {
              lat: 38.86871,
              lng: -92.49803009999999,
            },
          },
        },
        place_id: 'ChIJH1jvHSXG3IcRT7WVXYMmQ6w',
        postcode_localities: [
          'Cleveland Township',
          'Columbia',
          'Columbia Township',
          'Katy Township',
          'Missouri Township',
          'Perche Township',
          'Rocky Fork Township',
        ],
        types: ['postal_code'],
      },
    ],
    status: 'OK',
  },
}

export const placeDetailsResponse: PlaceDetailsResponse = {
  data: {
    error_message: '',
    html_attributions: [],
    result: {
      formatted_address: '225 S 9th St, Columbia, MO 65201, USA',
      formatted_phone_number: '(573) 449-2454',
      international_phone_number: '+1 573-449-2454',
      name: "Shakespeare's Pizza - Downtown",
      opening_hours: {
        open_now: true,
        periods: [
          {
            close: {
              day: 0,
              time: '2200',
            },
            open: {
              day: 0,
              time: '1100',
            },
          },
          {
            close: {
              day: 1,
              time: '2200',
            },
            open: {
              day: 1,
              time: '1100',
            },
          },
          {
            close: {
              day: 2,
              time: '2200',
            },
            open: {
              day: 2,
              time: '1100',
            },
          },
          {
            close: {
              day: 3,
              time: '2200',
            },
            open: {
              day: 3,
              time: '1100',
            },
          },
          {
            close: {
              day: 4,
              time: '2200',
            },
            open: {
              day: 4,
              time: '1100',
            },
          },
          {
            close: {
              day: 5,
              time: '2300',
            },
            open: {
              day: 5,
              time: '1100',
            },
          },
          {
            close: {
              day: 6,
              time: '2300',
            },
            open: {
              day: 6,
              time: '1100',
            },
          },
        ],
        weekday_text: [
          'Monday: 11:00 AM – 10:00 PM',
          'Tuesday: 11:00 AM – 10:00 PM',
          'Wednesday: 11:00 AM – 10:00 PM',
          'Thursday: 11:00 AM – 10:00 PM',
          'Friday: 11:00 AM – 11:00 PM',
          'Saturday: 11:00 AM – 11:00 PM',
          'Sunday: 11:00 AM – 10:00 PM',
        ],
      },
      photos: [
        {
          height: 3024,
          html_attributions: [
            '\u003ca href="https://maps.google.com/maps/contrib/102034557880036131940"\u003eSafy AJ\u003c/a\u003e',
          ],
          photo_reference:
            'Aap_uEDnq1leRNWMFguihkB3NOZLOPHAvCkbEuqVo_jFdd61VgnV5Dn0VKNjN_GTSdj1tXVVstqK0mXq5nmWj40MyoW_R3XqkDMkyv_oAnaYy1wSTF4eMbeljLCPptVFfyxpM1yOMPSzj4O9nh0xROEIp506mnD2bqQnEN-qaEsC_l-TRFLX',
          width: 4032,
        },
      ],
      website: 'http://www.shakespeares.com/',
    },
    status: 'OK',
  },
} as PlaceDetailsResponse

export const placeId = 'ChIJk8cmpsa33IcRbKLpDn3le4g'

export const placeResponse = {
  data: {
    html_attributions: [],
    next_page_token:
      'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
    results: [
      {
        business_status: 'OPERATIONAL',
        geometry: {
          location: {
            lat: 38.94866949999999,
            lng: -92.32790639999999,
          },
          viewport: {
            northeast: {
              lat: 38.9499477802915,
              lng: -92.3268417197085,
            },
            southwest: {
              lat: 38.9472498197085,
              lng: -92.3295396802915,
            },
          },
        },
        icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png',
        icon_background_color: '#7B9EB0',
        icon_mask_base_uri: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/generic_pinlet',
        name: "Shakespeare's Pizza - Downtown",
        opening_hours: {
          open_now: false,
        },
        photos: [
          {
            height: 3024,
            html_attributions: [
              '\u003ca href="https://maps.google.com/maps/contrib/102034557880036131940"\u003eSafy AJ\u003c/a\u003e',
            ],
            photo_reference:
              'Aap_uEDnq1leRNWMFguihkB3NOZLOPHAvCkbEuqVo_jFdd61VgnV5Dn0VKNjN_GTSdj1tXVVstqK0mXq5nmWj40MyoW_R3XqkDMkyv_oAnaYy1wSTF4eMbeljLCPptVFfyxpM1yOMPSzj4O9nh0xROEIp506mnD2bqQnEN-qaEsC_l-TRFLX',
            width: 4032,
          },
        ],
        place_id: 'ChIJk8cmpsa33IcRbKLpDn3le4g',
        plus_code: {
          compound_code: 'WMXC+FR Columbia, MO, USA',
          global_code: '86C9WMXC+FR',
        },
        price_level: 2,
        rating: 4.6,
        reference: 'ChIJk8cmpsa33IcRbKLpDn3le4g',
        scope: 'GOOGLE',
        types: ['meal_delivery', 'meal_takeaway', 'restaurant', 'food', 'point_of_interest', 'store', 'establishment'],
        user_ratings_total: 2060,
        vicinity: '225 South 9th Street, Columbia',
      },
      {
        business_status: 'OPERATIONAL',
        geometry: {
          location: {
            lat: 38.9898053,
            lng: -92.32347180000001,
          },
          viewport: {
            northeast: {
              lat: 38.9909426302915,
              lng: -92.32232511970849,
            },
            southwest: {
              lat: 38.98824466970851,
              lng: -92.32502308029152,
            },
          },
        },
        icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
        icon_background_color: '#FF9E67',
        icon_mask_base_uri: 'https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet',
        name: 'China Moon Restaurant',
        opening_hours: {
          open_now: false,
        },
        photos: [
          {
            height: 3024,
            html_attributions: [
              '\u003ca href="https://maps.google.com/maps/contrib/113787450722551411590"\u003eStephen McBee\u003c/a\u003e',
            ],
            photo_reference:
              'Aap_uEA6IltG2gkO9ofAPZGNIyD67MqYxRJvNw7opWlFTpSfMjgPqH1O9I4zg4qy21WUxn8d2a57mW6X5AHpX3Lqn4b669coZKbIyLJibwRCP1JQBT89TAo2ZjgaxZu2yzsDC0DrBS_HgvWB-XYB0Thmq6RvxHuqFlzXt_piT_kLFbJYhcPO',
            width: 4032,
          },
        ],
        place_id: 'ChIJiTfsP_vJ3IcRs74EWg563vY',
        plus_code: {
          compound_code: 'XMQG+WJ Columbia, MO, USA',
          global_code: '86C9XMQG+WJ',
        },
        price_level: 1,
        rating: 4.2,
        reference: 'ChIJiTfsP_vJ3IcRs74EWg563vY',
        scope: 'GOOGLE',
        types: ['restaurant', 'food', 'point_of_interest', 'establishment'],
        user_ratings_total: 296,
        vicinity: '3890 Rangeline Street, Columbia',
      },
    ],
    status: 'OK',
  },
}

export const placeResult = {
  data: [place1, place2],
  nextPageToken:
    'Aap_uED5ulA1bsoLWnkyaDlG1aoxuxgcx8pxnXBzkdbURX3PZwuzXgFtdbkLlJxjvqqCRa1iug_VSAiISjiApmg9yLOXQgWjMDbXuAGnVZaFARBlnfsRe5tjjVx_PKYEZv7iHNYwcvXR9eWvp8k1XMDBkj7Ja-YpLe9r8eAy1nZC-O9-1_M-lRNMNBr3YxCvWY57VXcP5F6-EPpj5vMAoHQ2e65TBGofxvsAkUX8HSvbHTKDCcYoQJUmwJQfeamM9H5stiJ137Ip98aMrEASSqCYCf9osGhRx7lbjZl4jUYKS-Y-8BejokmFWLtldff0SKuKQQrlef4E0xrdXr1jUh-uRVZTJoCq6Ki1AhiSM9qEvl0_EHYzAMbeQ9bCn0O_AlO6xstNfozKpz8SXXEiqpWaGXyaUqz-NU2facRhhZqPROSb',
}

export const recaptchaToken = 'ytrewsdfghjmnbgtyu'

export const reverseGeocodeResult = {
  plus_code: {
    compound_code: 'VXX7+59P Washington, DC, USA',
    global_code: '87C4VXX7+59P',
  },
  results: [
    {
      address_components: [
        {
          long_name: '1600',
          short_name: '1600',
          types: ['street_number'],
        },
        {
          long_name: 'Pennsylvania Avenue Northwest',
          short_name: 'Pennsylvania Avenue NW',
          types: ['route'],
        },
        {
          long_name: 'Northwest Washington',
          short_name: 'Northwest Washington',
          types: ['neighborhood', 'political'],
        },
        {
          long_name: 'Washington',
          short_name: 'Washington',
          types: ['locality', 'political'],
        },
        {
          long_name: 'District of Columbia',
          short_name: 'DC',
          types: ['administrative_area_level_1', 'political'],
        },
        {
          long_name: 'United States',
          short_name: 'US',
          types: ['country', 'political'],
        },
        {
          long_name: '20500',
          short_name: '20500',
          types: ['postal_code'],
        },
      ],
      formatted_address: '1600 Pennsylvania Avenue NW, Washington, DC 20500, USA',
      geometry: {
        location: {
          lat: 38.8976633,
          lng: -77.03657389999999,
        },
        location_type: 'ROOFTOP',
        viewport: {
          northeast: {
            lat: 38.8990122802915,
            lng: -77.0352249197085,
          },
          southwest: {
            lat: 38.8963143197085,
            lng: -77.0379228802915,
          },
        },
      },
      place_id: 'ChIJcw5BAI63t4kRj5qZY1MSyAo',
      plus_code: {
        compound_code: 'VXX7+39 Washington, DC, USA',
        global_code: '87C4VXX7+39',
      },
      types: ['street_address'],
    },
  ],
  status: 'OK',
}

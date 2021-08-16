import type { MDbMovie } from "../../types/typesMDb";
import type { MediaDiaryWithId, MediaSelected } from "../../types/typesMedia";

export const mockMovieSelected: MediaSelected = {
  releasedDate: "2015-05-13T07:00:00.000Z",
  mediaId: "76341",
  poster: "8tZYtuWezp8JbcsvHYO0O46tFbo",
  type: "movie",
  title: "Mad Max: Fury Road",
  artist: "George Miller",
  genre: "action",
  bookmark: false,
  memory: false,
  diary: false,
};

export const mockMovieDiaryWithId: MediaDiaryWithId = {
  diaryYear: 2019,
  releasedYear: 2015,
  loggedBefore: true,
  diary: true,
  mediaId: "76341",
  addedDate: "2020-12-24T09:17:07.861Z",
  title: "Mad Max: Fury Road",
  poster: "8tZYtuWezp8JbcsvHYO0O46tFbo",
  genre: "action",
  id: "OEbKA4NXytlPRH2MkgZ1",
  diaryDate: "2019-01-12T08:00:00.000Z",
  artist: "George Miller",
  rating: 5,
  bookmark: false,
  memory: true,
  releasedDate: "2015-05-13T07:00:00.000Z",
  releasedDecade: 2010,
  type: "movie",
  search_title: [
    "mad max fury road",
    "m",
    "ma",
    "mad",
    "mad ",
    "mad m",
    "mad ma",
    "mad max",
    "mad max ",
    "mad max f",
    "mad max fu",
    "mad max fur",
    "mad max fury",
    "mad max fury ",
    "mad max fury r",
    "mad max fury ro",
    "mad max fury roa",
    "mad max fury road",
    "g",
    "ge",
    "geo",
    "geor",
    "georg",
    "george",
    "george ",
    "george m",
    "george mi",
    "george mil",
    "george mill",
    "george mille",
    "george miller",
  ],
};

export const mockMovieFetchData: MDbMovie = {
  adult: false,
  backdrop_path: "/nlCHUWjY9XWbuEUQauCBgnY8ymF.jpg",
  budget: 150000000,
  genres: [
    {
      id: 28,
      name: "Action",
    },
    {
      id: 12,
      name: "Adventure",
    },
    {
      id: 878,
      name: "Science Fiction",
    },
  ],
  homepage: "https://www.warnerbros.com/movies/mad-max-fury-road",
  id: 76341,
  imdb_id: "tt1392190",
  original_language: "en",
  original_title: "Mad Max: Fury Road",
  overview:
    "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken, and most everyone is crazed fighting for the necessities of life. Within this world exist two rebels on the run who just might be able to restore order.",
  popularity: 50.41,
  poster_path: "/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
  release_date: "2015-05-13",
  revenue: 378858340,
  runtime: 121,
  spoken_languages: [
    {
      english_name: "English",
      iso_639_1: "en",
      name: "English",
    },
  ],
  status: "Released",
  tagline: "What a Lovely Day.",
  title: "Mad Max: Fury Road",
  video: false,
  vote_average: 7.5,
  vote_count: 18167,
  credits: {
    cast: [
      {
        adult: false,
        gender: 2,
        id: 2524,
        known_for_department: "Acting",
        name: "Tom Hardy",
        original_name: "Tom Hardy",
        popularity: 19.811,
        profile_path: "/sGMA6pA2D6X0gun49igJT3piHs3.jpg",
        cast_id: 2,
        character: "Max Rockatansky",
        credit_id: "52fe4933c3a368484e11f773",
        order: 0,
      },
      {
        adult: false,
        gender: 1,
        id: 6885,
        known_for_department: "Acting",
        name: "Charlize Theron",
        original_name: "Charlize Theron",
        popularity: 14.081,
        profile_path: "/1HloWLLhL3iTrmDtMigiitLB9Qx.jpg",
        cast_id: 35,
        character: "Imperator Furiosa",
        credit_id: "560e8a2bc3a368681f00b80c",
        order: 1,
      },
      {
        adult: false,
        gender: 2,
        id: 3292,
        known_for_department: "Acting",
        name: "Nicholas Hoult",
        original_name: "Nicholas Hoult",
        popularity: 7.162,
        profile_path: "/yFDOsethQcoguEjOJp7JH2sFpI3.jpg",
        cast_id: 4,
        character: "Nux",
        credit_id: "52fe4933c3a368484e11f77b",
        order: 2,
      },
      {
        adult: false,
        gender: 2,
        id: 26060,
        known_for_department: "Acting",
        name: "Hugh Keays-Byrne",
        original_name: "Hugh Keays-Byrne",
        popularity: 3.117,
        profile_path: "/7XSPjKNwmyEPMnmoVSQ42ykMz6M.jpg",
        cast_id: 21,
        character: "Immortan Joe",
        credit_id: "55549e64c3a3682086002b85",
        order: 3,
      },
      {
        adult: false,
        gender: 2,
        id: 1056053,
        known_for_department: "Acting",
        name: "Josh Helman",
        original_name: "Josh Helman",
        popularity: 3.233,
        profile_path: "/1thwLjrgvFv7ifjyVtTKQh23OCh.jpg",
        cast_id: 22,
        character: "Slit",
        credit_id: "55549e84c3a36820800028e6",
        order: 4,
      },
      {
        adult: false,
        gender: 2,
        id: 24898,
        known_for_department: "Acting",
        name: "Nathan Jones",
        original_name: "Nathan Jones",
        popularity: 3.513,
        profile_path: "/hlu4qYy9JGPxGn0wT8Ea6mTWR8R.jpg",
        cast_id: 14,
        character: "Rictus Erectus",
        credit_id: "53d450f70e0a26283e002f36",
        order: 5,
      },
      {
        adult: false,
        gender: 1,
        id: 37153,
        known_for_department: "Acting",
        name: "Zoë Kravitz",
        original_name: "Zoë Kravitz",
        popularity: 9.331,
        profile_path: "/zx74kkI931iiQATJybvRKWYnOe9.jpg",
        cast_id: 8,
        character: "Toast the Knowing",
        credit_id: "52fe4933c3a368484e11f787",
        order: 6,
      },
    ],
    crew: [
      {
        adult: false,
        gender: 2,
        id: 20629,
        known_for_department: "Directing",
        name: "George Miller",
        original_name: "George Miller",
        popularity: 3.955,
        profile_path: "/4FyQESSzuu1VkPup9CmMjdnUyhv.jpg",
        credit_id: "52fe4933c3a368484e11f76f",
        department: "Directing",
        job: "Director",
      },
    ],
  },
  videos: {
    results: [
      {
        id: "5bcd26e39251416131016aba",
        iso_639_1: "en",
        iso_3166_1: "US",
        key: "akX3Is3qBpw",
        name: "Comic-Con First Look [HD]",
        site: "YouTube",
        size: 1080,
        type: "Teaser",
      },
      {
        id: "5bcd26f9925141612a0157ce",
        iso_639_1: "en",
        iso_3166_1: "US",
        key: "hEJnMQG9ev8",
        name: "Official Main Trailer [HD]",
        site: "YouTube",
        size: 1080,
        type: "Trailer",
      },
      {
        id: "5bcd2702c3a3682863018582",
        iso_639_1: "en",
        iso_3166_1: "US",
        key: "MonFNCgK4WE",
        name: "Official Retaliate Trailer [HD]",
        site: "YouTube",
        size: 1080,
        type: "Trailer",
      },
      {
        id: "5bcd26ef9251416126015b7d",
        iso_639_1: "en",
        iso_3166_1: "US",
        key: "YWNWi-ZWL3c",
        name: "Official Theatrical Teaser Trailer [HD]",
        site: "YouTube",
        size: 1080,
        type: "Trailer",
      },
    ],
  },
  "watch/providers": {
    results: {
      US: {
        link: "https://www.themoviedb.org/movie/76341-mad-max-fury-road/watch?locale=US",
        buy: [
          {
            display_priority: 2,
            logo_path: "/q6tl6Ib6X5FT80RMlcDbexIo4St.jpg",
            provider_id: 2,
            provider_name: "Apple iTunes",
          },
          {
            display_priority: 3,
            logo_path: "/p3Z12gKq2qvJaUOMeKNU2mzKVI9.jpg",
            provider_id: 3,
            provider_name: "Google Play Movies",
          },
          {
            display_priority: 10,
            logo_path: "/sVBEF7q7LqjHAWSnKwDbzmr2EMY.jpg",
            provider_id: 10,
            provider_name: "Amazon Video",
          },
          {
            display_priority: 12,
            logo_path: "/vDCcryHD32b0yMeSCgBhuYavsmx.jpg",
            provider_id: 192,
            provider_name: "YouTube",
          },
          {
            display_priority: 32,
            logo_path: "/pgaPsqgFh2grkcr7ROkoBajHJnf.jpg",
            provider_id: 7,
            provider_name: "Vudu",
          },
          {
            display_priority: 43,
            logo_path: "/paq2o2dIfQnxcERsVoq7Ys8KYz8.jpg",
            provider_id: 68,
            provider_name: "Microsoft Store",
          },
          {
            display_priority: 45,
            logo_path: "/nSr2IQSwc5C2QrttIWen8s06ofe.jpg",
            provider_id: 279,
            provider_name: "Redbox",
          },
          {
            display_priority: 49,
            logo_path: "/qZdEeINwQotbr1Rq15dL5G2BaAh.jpg",
            provider_id: 358,
            provider_name: "DIRECTV",
          },
          {
            display_priority: 131,
            logo_path: "/p1e92kLeYHalxC9GClqNJ75lBDG.jpg",
            provider_id: 352,
            provider_name: "AMC on Demand",
          },
        ],
        rent: [
          {
            display_priority: 2,
            logo_path: "/q6tl6Ib6X5FT80RMlcDbexIo4St.jpg",
            provider_id: 2,
            provider_name: "Apple iTunes",
          },
          {
            display_priority: 3,
            logo_path: "/p3Z12gKq2qvJaUOMeKNU2mzKVI9.jpg",
            provider_id: 3,
            provider_name: "Google Play Movies",
          },
          {
            display_priority: 10,
            logo_path: "/sVBEF7q7LqjHAWSnKwDbzmr2EMY.jpg",
            provider_id: 10,
            provider_name: "Amazon Video",
          },
          {
            display_priority: 12,
            logo_path: "/vDCcryHD32b0yMeSCgBhuYavsmx.jpg",
            provider_id: 192,
            provider_name: "YouTube",
          },
          {
            display_priority: 32,
            logo_path: "/pgaPsqgFh2grkcr7ROkoBajHJnf.jpg",
            provider_id: 7,
            provider_name: "Vudu",
          },
          {
            display_priority: 43,
            logo_path: "/paq2o2dIfQnxcERsVoq7Ys8KYz8.jpg",
            provider_id: 68,
            provider_name: "Microsoft Store",
          },
          {
            display_priority: 45,
            logo_path: "/nSr2IQSwc5C2QrttIWen8s06ofe.jpg",
            provider_id: 279,
            provider_name: "Redbox",
          },
          {
            display_priority: 49,
            logo_path: "/qZdEeINwQotbr1Rq15dL5G2BaAh.jpg",
            provider_id: 358,
            provider_name: "DIRECTV",
          },
          {
            display_priority: 131,
            logo_path: "/p1e92kLeYHalxC9GClqNJ75lBDG.jpg",
            provider_id: 352,
            provider_name: "AMC on Demand",
          },
        ],
      },
    },
  },
};
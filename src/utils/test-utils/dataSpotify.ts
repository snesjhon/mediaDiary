import type { DataFetchSpotify } from "../../config/useDataFetch";
import type { MediaDiaryWithId } from "../../types/typesMedia";

export const mockAlbumDiaryWithId: MediaDiaryWithId = {
  title: "Atrocity Exhibition",
  artistId: "7aA592KWirLsnfb5ulGWvU",
  bookmark: false,
  memory: true,
  diary: true,
  genre: "alternative hip hop",
  rating: 4.5,
  releasedDecade: 2010,
  diaryYear: 2021,
  id: "ClKM6oZRwiMsa5PObvrY",
  loggedBefore: true,
  addedDate: "2021-07-05T02:00:07.098Z",
  poster: "ab67616d0000b2733e25c9ef701bb637773531fe",
  type: "album",
  releasedDate: "2016-09-27T07:00:00.000Z",
  diaryDate: "2021-07-05T02:00:00.053Z",
  mediaId: "3e7vtKJ3m1zVh38VGq2g3H",
  artist: "Danny Brown",
  releasedYear: 2016,
};

export const mockAlbumFetchData: DataFetchSpotify = [
  {
    album_type: "album",
    artists: [
      {
        external_urls: {
          spotify: "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
        },
        href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
        id: "7aA592KWirLsnfb5ulGWvU",
        name: "Danny Brown",
        type: "artist",
        uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
      },
    ],
    available_markets: ["US"],
    copyrights: [
      {
        text: "2016 Warp Records Limited",
        type: "C",
      },
      {
        text: "2016 Warp Records Limited",
        type: "P",
      },
    ],
    external_ids: {
      upc: "0801061027636",
    },
    external_urls: {
      spotify: "https://open.spotify.com/album/3e7vtKJ3m1zVh38VGq2g3H",
    },
    genres: [],
    href: "https://api.spotify.com/v1/albums/3e7vtKJ3m1zVh38VGq2g3H",
    id: "3e7vtKJ3m1zVh38VGq2g3H",
    images: [
      {
        height: 640,
        url: "https://i.scdn.co/image/ab67616d0000b2733e25c9ef701bb637773531fe",
        width: 640,
      },
      {
        height: 300,
        url: "https://i.scdn.co/image/ab67616d00001e023e25c9ef701bb637773531fe",
        width: 300,
      },
      {
        height: 64,
        url: "https://i.scdn.co/image/ab67616d000048513e25c9ef701bb637773531fe",
        width: 64,
      },
    ],
    label: "Warp Records",
    name: "Atrocity Exhibition",
    popularity: 54,
    release_date: "2016-09-27",
    release_date_precision: "day",
    total_tracks: 15,
    tracks: {
      href: "https://api.spotify.com/v1/albums/3e7vtKJ3m1zVh38VGq2g3H/tracks?offset=0&limit=50",
      items: [
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 172302,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/6iWbJdNf6Fl9y298RDZfrc",
          },
          href: "https://api.spotify.com/v1/tracks/6iWbJdNf6Fl9y298RDZfrc",
          id: "6iWbJdNf6Fl9y298RDZfrc",
          is_local: false,
          name: "Downward Spiral",
          preview_url:
            "https://p.scdn.co/mp3-preview/3d5a356179b7e101d035131017d0a32fef2da148?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 1,
          type: "track",
          uri: "spotify:track:6iWbJdNf6Fl9y298RDZfrc",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 151979,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/3yM8iyra4fkuyf0H5RFHuE",
          },
          href: "https://api.spotify.com/v1/tracks/3yM8iyra4fkuyf0H5RFHuE",
          id: "3yM8iyra4fkuyf0H5RFHuE",
          is_local: false,
          name: "Tell Me What I Don't Know",
          preview_url:
            "https://p.scdn.co/mp3-preview/b89df97d1e5d278848288c898503926369bf4de1?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 2,
          type: "track",
          uri: "spotify:track:3yM8iyra4fkuyf0H5RFHuE",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/4dGwtd1FYag1VY1vaR1U8y",
              },
              href: "https://api.spotify.com/v1/artists/4dGwtd1FYag1VY1vaR1U8y",
              id: "4dGwtd1FYag1VY1vaR1U8y",
              name: "Petite Noir",
              type: "artist",
              uri: "spotify:artist:4dGwtd1FYag1VY1vaR1U8y",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 227981,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/1LUyHPbfI0EXbMkvHR0PNX",
          },
          href: "https://api.spotify.com/v1/tracks/1LUyHPbfI0EXbMkvHR0PNX",
          id: "1LUyHPbfI0EXbMkvHR0PNX",
          is_local: false,
          name: "Rolling Stone",
          preview_url:
            "https://p.scdn.co/mp3-preview/a9d4b4be0ae9d8c8b7f4007960320b0bdd5cc153?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 3,
          type: "track",
          uri: "spotify:track:1LUyHPbfI0EXbMkvHR0PNX",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/2YZyLoL8N0Wb9xBt1NhZWg",
              },
              href: "https://api.spotify.com/v1/artists/2YZyLoL8N0Wb9xBt1NhZWg",
              id: "2YZyLoL8N0Wb9xBt1NhZWg",
              name: "Kendrick Lamar",
              type: "artist",
              uri: "spotify:artist:2YZyLoL8N0Wb9xBt1NhZWg",
            },
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/0g9vAlRPK9Gt3FKCekk4TW",
              },
              href: "https://api.spotify.com/v1/artists/0g9vAlRPK9Gt3FKCekk4TW",
              id: "0g9vAlRPK9Gt3FKCekk4TW",
              name: "Ab-Soul",
              type: "artist",
              uri: "spotify:artist:0g9vAlRPK9Gt3FKCekk4TW",
            },
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/3A5tHz1SfngyOZM2gItYKu",
              },
              href: "https://api.spotify.com/v1/artists/3A5tHz1SfngyOZM2gItYKu",
              id: "3A5tHz1SfngyOZM2gItYKu",
              name: "Earl Sweatshirt",
              type: "artist",
              uri: "spotify:artist:3A5tHz1SfngyOZM2gItYKu",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 319433,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/6dHatCnuOb1TdBIeJTK3Y0",
          },
          href: "https://api.spotify.com/v1/tracks/6dHatCnuOb1TdBIeJTK3Y0",
          id: "6dHatCnuOb1TdBIeJTK3Y0",
          is_local: false,
          name: "Really Doe",
          preview_url:
            "https://p.scdn.co/mp3-preview/2ac75fb959d5088a66fcbdeef4373ae5c6786522?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 4,
          type: "track",
          uri: "spotify:track:6dHatCnuOb1TdBIeJTK3Y0",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 127255,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/1IIWODSnr5MIIwpdHyX10P",
          },
          href: "https://api.spotify.com/v1/tracks/1IIWODSnr5MIIwpdHyX10P",
          id: "1IIWODSnr5MIIwpdHyX10P",
          is_local: false,
          name: "Lost",
          preview_url:
            "https://p.scdn.co/mp3-preview/7d3c8db80ea0cefc60f9b4826037893cf2f1e096?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 5,
          type: "track",
          uri: "spotify:track:1IIWODSnr5MIIwpdHyX10P",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 177025,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/7ItFoQDmQIh3MAPsxiP6Vt",
          },
          href: "https://api.spotify.com/v1/tracks/7ItFoQDmQIh3MAPsxiP6Vt",
          id: "7ItFoQDmQIh3MAPsxiP6Vt",
          is_local: false,
          name: "Ain't it Funny",
          preview_url:
            "https://p.scdn.co/mp3-preview/2d8a26b57fa210879b2a802903421118a83e373e?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 6,
          type: "track",
          uri: "spotify:track:7ItFoQDmQIh3MAPsxiP6Vt",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 144118,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/6iMo7yzmXqMC57FOHOSotz",
          },
          href: "https://api.spotify.com/v1/tracks/6iMo7yzmXqMC57FOHOSotz",
          id: "6iMo7yzmXqMC57FOHOSotz",
          is_local: false,
          name: "Golddust",
          preview_url:
            "https://p.scdn.co/mp3-preview/f98a570279f546891a2445e41997a269802aa61a?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 7,
          type: "track",
          uri: "spotify:track:6iMo7yzmXqMC57FOHOSotz",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 143729,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/3fqfuK6PQITWU0fCKfo31d",
          },
          href: "https://api.spotify.com/v1/tracks/3fqfuK6PQITWU0fCKfo31d",
          id: "3fqfuK6PQITWU0fCKfo31d",
          is_local: false,
          name: "White Lines",
          preview_url:
            "https://p.scdn.co/mp3-preview/12bf96a1e57e4fc9d9b23ad07ffd5adc40caaf9d?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 8,
          type: "track",
          uri: "spotify:track:3fqfuK6PQITWU0fCKfo31d",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 219883,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/6l2Q1Jb5c2VycqDEzp5ZlJ",
          },
          href: "https://api.spotify.com/v1/tracks/6l2Q1Jb5c2VycqDEzp5ZlJ",
          id: "6l2Q1Jb5c2VycqDEzp5ZlJ",
          is_local: false,
          name: "Pneumonia",
          preview_url:
            "https://p.scdn.co/mp3-preview/2524418cdb7b8fec1e4d7d838c741b1f23bb3bfd?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 9,
          type: "track",
          uri: "spotify:track:6l2Q1Jb5c2VycqDEzp5ZlJ",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 157930,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/2kmpyKQjVw5UOcVlmkxnYY",
          },
          href: "https://api.spotify.com/v1/tracks/2kmpyKQjVw5UOcVlmkxnYY",
          id: "2kmpyKQjVw5UOcVlmkxnYY",
          is_local: false,
          name: "Dance In The Water",
          preview_url:
            "https://p.scdn.co/mp3-preview/78978919f61868bab59bbdf4182e8aabf482eaed?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 10,
          type: "track",
          uri: "spotify:track:2kmpyKQjVw5UOcVlmkxnYY",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/1U0sIzpRtDkvu1hXXzxh60",
              },
              href: "https://api.spotify.com/v1/artists/1U0sIzpRtDkvu1hXXzxh60",
              id: "1U0sIzpRtDkvu1hXXzxh60",
              name: "Kelela",
              type: "artist",
              uri: "spotify:artist:1U0sIzpRtDkvu1hXXzxh60",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 138991,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/4Hg2p5WhkmqAPASAGaZ7YA",
          },
          href: "https://api.spotify.com/v1/tracks/4Hg2p5WhkmqAPASAGaZ7YA",
          id: "4Hg2p5WhkmqAPASAGaZ7YA",
          is_local: false,
          name: "From The Ground",
          preview_url:
            "https://p.scdn.co/mp3-preview/19859a8aa9145fbd1bf26a093b64affb54f5ad78?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 11,
          type: "track",
          uri: "spotify:track:4Hg2p5WhkmqAPASAGaZ7YA",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 195966,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/2DGbSEkVncvcUJzFYN0V9y",
          },
          href: "https://api.spotify.com/v1/tracks/2DGbSEkVncvcUJzFYN0V9y",
          id: "2DGbSEkVncvcUJzFYN0V9y",
          is_local: false,
          name: "When It Rain",
          preview_url:
            "https://p.scdn.co/mp3-preview/f9847d24620ddbc7476cd66cfb6e406526031274?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 12,
          type: "track",
          uri: "spotify:track:2DGbSEkVncvcUJzFYN0V9y",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 187679,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/7kTxncRUYhC8PC1v70moeN",
          },
          href: "https://api.spotify.com/v1/tracks/7kTxncRUYhC8PC1v70moeN",
          id: "7kTxncRUYhC8PC1v70moeN",
          is_local: false,
          name: "Today",
          preview_url:
            "https://p.scdn.co/mp3-preview/74c180790e7bd9c47c0c94a67954e3fe665efddd?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 13,
          type: "track",
          uri: "spotify:track:7kTxncRUYhC8PC1v70moeN",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/2LiWxiQzuD9nmWQ6NCA8Gd",
              },
              href: "https://api.spotify.com/v1/artists/2LiWxiQzuD9nmWQ6NCA8Gd",
              id: "2LiWxiQzuD9nmWQ6NCA8Gd",
              name: "B-Real",
              type: "artist",
              uri: "spotify:artist:2LiWxiQzuD9nmWQ6NCA8Gd",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 213477,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/7kKEXvq4NQ9OatQs906MGV",
          },
          href: "https://api.spotify.com/v1/tracks/7kKEXvq4NQ9OatQs906MGV",
          id: "7kKEXvq4NQ9OatQs906MGV",
          is_local: false,
          name: "Get Hi",
          preview_url:
            "https://p.scdn.co/mp3-preview/e3178d027df6f924f6a679869967b32814fe4b23?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 14,
          type: "track",
          uri: "spotify:track:7kKEXvq4NQ9OatQs906MGV",
        },
        {
          artists: [
            {
              external_urls: {
                spotify:
                  "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
              },
              href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
              id: "7aA592KWirLsnfb5ulGWvU",
              name: "Danny Brown",
              type: "artist",
              uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
            },
          ],
          available_markets: ["US"],
          disc_number: 1,
          duration_ms: 229776,
          explicit: true,
          external_urls: {
            spotify: "https://open.spotify.com/track/0Sxs6lEQ9FuE9i02bfh2z3",
          },
          href: "https://api.spotify.com/v1/tracks/0Sxs6lEQ9FuE9i02bfh2z3",
          id: "0Sxs6lEQ9FuE9i02bfh2z3",
          is_local: false,
          name: "Hell For It",
          preview_url:
            "https://p.scdn.co/mp3-preview/cf3192ed98740d871adfbef09cd39c82484caf27?cid=cd408c25ac204f30bbc84f9921c68c1e",
          track_number: 15,
          type: "track",
          uri: "spotify:track:0Sxs6lEQ9FuE9i02bfh2z3",
        },
      ],
      limit: 50,
      next: null,
      offset: 0,
      previous: null,
      total: 15,
    },
    type: "album",
    uri: "spotify:album:3e7vtKJ3m1zVh38VGq2g3H",
  },
  {
    external_urls: {
      spotify: "https://open.spotify.com/artist/7aA592KWirLsnfb5ulGWvU",
    },
    followers: {
      href: null,
      total: 616666,
    },
    genres: [
      "alternative hip hop",
      "detroit hip hop",
      "escape room",
      "hip hop",
      "rap",
      "underground hip hop",
    ],
    href: "https://api.spotify.com/v1/artists/7aA592KWirLsnfb5ulGWvU",
    id: "7aA592KWirLsnfb5ulGWvU",
    images: [
      {
        height: 1000,
        url: "https://i.scdn.co/image/faa6e815719c8abadc0dc982e68c4c6b1f8f310a",
        width: 1000,
      },
      {
        height: 640,
        url: "https://i.scdn.co/image/0f765c4f0676b9f7b0537b85241486577052d57c",
        width: 640,
      },
      {
        height: 200,
        url: "https://i.scdn.co/image/416cf799180c3d90e851f390b50af23c1998f6f3",
        width: 200,
      },
      {
        height: 64,
        url: "https://i.scdn.co/image/70cb1a93b8d5381039a5748f57eb35a199d4d655",
        width: 64,
      },
    ],
    name: "Danny Brown",
    popularity: 65,
    type: "artist",
    uri: "spotify:artist:7aA592KWirLsnfb5ulGWvU",
  },
];

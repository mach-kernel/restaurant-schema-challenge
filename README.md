# restaurant-schema-challenge
leveraging cross-platform synergies and probably microsoft edge


[![Code Climate](https://codeclimate.com/github/mach-kernel/restaurant-schema-challenge/badges/gpa.svg)](https://codeclimate.com/github/mach-kernel/restaurant-schema-challenge)
[![Test Coverage](https://codeclimate.com/github/mach-kernel/restaurant-schema-challenge/badges/coverage.svg)](https://codeclimate.com/github/mach-kernel/restaurant-schema-challenge/coverage)
[![CircleCI](https://circleci.com/gh/mach-kernel/restaurant-schema-challenge/tree/master.svg?style=shield)](https://circleci.com/gh/mach-kernel/restaurant-schema-challenge/tree/master)

## Getting Started

### Requirements
- node.js runtime with npm, and bower installed globally
- mongodb

### Setup
```
git clone
bundle
rake db:mongoid:create_indexes
foreman start (might want to background this or use sep. tmux tab)
rails s
```

## API

### HAL
The resource schemas use [HAL](http://stateless.co/hal_specification.html). As a brief overview, HAL allows a user to traverse API resource relationships as each entity (ideally) should be reflective.

For example, to access a location that is associated with a brand, just navigate to its resource URL, or in this case, `/v1/location/57cee2ebb4ed495608b1cfe7`. `self` will be present for each request, to show the user where they are, and for each entity, to allow easy traversal. 

```
{
  "name": "McDonalds",
  "links": [
    {
      "rel": "self",
      "href": "http:\/\/localhost:3000\/v1\/brand\/57cee2ebb4ed495608b1cfe5"
    }
  ],
  "locations": [
    {
      "name": "McLoc 0",
      "links": [
        {
          "rel": "self",
          "href": "http:\/\/localhost:3000\/v1\/location\/57cee2ebb4ed495608b1cfe7"
        },
        {
          "rel": "brand",
          "href": "http:\/\/localhost:3000\/v1\/brand\/57cee2ebb4ed495608b1cfe5"
        }
      ],
      "order_types": [...],
      "day_parts": [...]
    },
  ]
}
```

### Resources

- Brand
  - Location
    - Order Type
    - Day Part (optional member)
  - Menu Item
    - Price Level (optional member)

Each resource supports standard `CRUD` operation (and thereby has an endpoint), and has its own entity in `app/entities`. Calling `GET` on a resource without an ID will use a generic `List` entity presenter with each resource present under `links/resources` array. When `GET`-ing a resource with an ID, all child documents will be sideloaded along with their children, into the response body.

**Note on deletions**: If you `DELETE` a parent entity, such as `Location` or `Brand`, you willalso delete its children!

### Example Requests

#### I want to see what brands I track

##### Request
`GET /v1/brand`

##### Response
```
{
  "links": [
    {
      "rel": "self",
      "href": "http:\/\/localhost:3000\/v1\/brand"
    },
    {
      "rel": "resources",
      "href": [
        "http:\/\/localhost:3000\/v1\/brand\/57cee2ebb4ed495608b1cfe5",
        "http:\/\/localhost:3000\/v1\/brand\/57cee2ebb4ed495608b1cfe6"
      ]
    }
  ]
}
```

#### I want to get a brand by ID

##### Request
`GET /v1/brand/57cee2ebb4ed495608b1cfe5`

##### Response
```
{
  "name": "McDonalds",
  "links": [
    {
      "rel": "self",
      "href": "http:\/\/localhost:3000\/v1\/brand\/57cee2ebb4ed495608b1cfe5"
    }
  ],
  "locations": [
    {
      "name": "McLoc 0",
      "links": [
        {
          "rel": "self",
          "href": "http:\/\/localhost:3000\/v1\/location\/57cee2ebb4ed495608b1cfe7"
        },
        {
          "rel": "brand",
          "href": "http:\/\/localhost:3000\/v1\/brand\/57cee2ebb4ed495608b1cfe5"
        }
      ],
      "order_types": [
        {
          "name": "Sit-In 0",
          "links": [
            {
              "rel": "self",
              "href": "http:\/\/localhost:3000\/v1\/order_type\/57cee2ebb4ed495608b1d005"
            },
            {
              "rel": "location",
              "href": "http:\/\/localhost:3000\/v1\/location\/57cee2ebb4ed495608b1d005"
            }
          ]
        },
        {
          "name": "Pigeon 0",
          "links": [
            {
              "rel": "self",
              "href": "http:\/\/localhost:3000\/v1\/order_type\/57cee2ebb4ed495608b1d00a"
            },
            {
              "rel": "location",
              "href": "http:\/\/localhost:3000\/v1\/location\/57cee2ebb4ed495608b1d00a"
            }
          ]
        }
      ],
      "day_parts": [
        {
          "name": "Breakfast 0",
          "links": [
            {
              "rel": "self",
              "href": "http:\/\/localhost:3000\/v1\/day_part\/57cee2ebb4ed495608b1cff1"
            },
            {
              "rel": "location",
              "href": "http:\/\/localhost:3000\/v1\/location\/57cee2ebb4ed495608b1cff1"
            }
          ]
        },
        {
          "name": "Dinner 0",
          "links": [
            {
              "rel": "self",
              "href": "http:\/\/localhost:3000\/v1\/day_part\/57cee2ebb4ed495608b1cff6"
            },
            {
              "rel": "location",
              "href": "http:\/\/localhost:3000\/v1\/location\/57cee2ebb4ed495608b1cff6"
            }
          ]
        }
      ]
    },
  ],
  "menu_items": [
    {
      "name": "McThing",
      "links": [
        {
          "rel": "self",
          "href": "http:\/\/localhost:3000\/v1\/menu_item\/57cee2ebb4ed495608b1d019"
        },
        {
          "rel": "brand",
          "href": "http:\/\/localhost:3000\/v1\/brand\/57cee2ebb4ed495608b1cfe5"
        }
      ],
      "price_levels": [
        {
          "name": "Price for McThing, Breakfast 0, Sit-In 0",
          "links": [
            {
              "rel": "self",
              "href": "http:\/\/localhost:3000\/v1\/price_level\/57cee2ebb4ed495608b1d01d"
            },
            {
              "rel": "order_type",
              "href": "http:\/\/localhost:3000\/v1\/order_type\/57cee2ebb4ed495608b1d01d"
            },
            {
              "rel": "menu_item",
              "href": "http:\/\/localhost:3000\/v1\/menu_item\/57cee2ebb4ed495608b1d01d"
            },
            {
              "rel": "day_part",
              "href": "http:\/\/localhost:3000\/v1\/day_part\/57cee2ebb4ed495608b1d01d"
            }
          ],
          "amount": "79"
        },
        {
          "name": "Price for McThing, Dinner 2, Sit-In 2",
          "links": [
            {
              "rel": "self",
              "href": "http:\/\/localhost:3000\/v1\/price_level\/57cee2ebb4ed495608b1d01f"
            },
            {
              "rel": "order_type",
              "href": "http:\/\/localhost:3000\/v1\/order_type\/57cee2ebb4ed495608b1d01f"
            },
            {
              "rel": "menu_item",
              "href": "http:\/\/localhost:3000\/v1\/menu_item\/57cee2ebb4ed495608b1d01f"
            },
            {
              "rel": "day_part",
              "href": "http:\/\/localhost:3000\/v1\/day_part\/57cee2ebb4ed495608b1d01f"
            }
          ],
          "amount": "68"
        },
        {
          "name": "Price for McThing, Dinner 4, Sit-In 4",
          "links": [
            {
              "rel": "self",
              "href": "http:\/\/localhost:3000\/v1\/price_level\/57cee2ebb4ed495608b1d021"
            },
            {
              "rel": "order_type",
              "href": "http:\/\/localhost:3000\/v1\/order_type\/57cee2ebb4ed495608b1d021"
            },
            {
              "rel": "menu_item",
              "href": "http:\/\/localhost:3000\/v1\/menu_item\/57cee2ebb4ed495608b1d021"
            },
            {
              "rel": "day_part",
              "href": "http:\/\/localhost:3000\/v1\/day_part\/57cee2ebb4ed495608b1d021"
            }
          ],
          "amount": "68"
        }
      ]
    },
  ]
}
```

## Testing

- Run all tests with `rake`
- When developing, run `guard` to watch the filesystem for changes
- Linting done by `rubocop` to [preserve style](https://xkcd.com/1513/)
- Please write a test for any new functionality

## TODO

- Don't include link to parent when sideloading from parent
- Put sideloaded resources into `_embedded` instead of root property to be more standard-compliant.

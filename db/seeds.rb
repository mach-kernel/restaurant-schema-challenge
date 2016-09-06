# frozen_string_literal: true
# Create two brands
mcdonalds = ::Brand.create(name: 'McDonalds')
burger_shot = ::Brand.create(name: 'Burger Shot')

# Create 5 locations for each
5.times.each { |x| ::Location.create(name: "McLoc #{x}", brand: mcdonalds) }
5.times.each { |x| ::Location.create(name: "BShot #{x}", brand: burger_shot) }

# Create Day Parts and Order Types for each Location
load = lambda do |locations, name, klass|
  locations.each.with_index do |loc, x|
    klass.create(name: "#{name} #{x}", location: loc)
  end
end

%w(Breakfast Dinner).each { |l| load.call(mcdonalds.locations, l, ::DayPart) }
%w(Breakfast Dinner).each { |l| load.call(burger_shot.locations, l, ::DayPart) }

%w(Sit-In Pigeon).each { |t| load.call(mcdonalds.locations, t, ::OrderType) }
%w(Sit-In Pigeon).each { |t| load.call(burger_shot.locations, t, ::OrderType) }

# Create Menu Items and Prices
%w(McThing McThat).each do |item|
  ::MenuItem.create(name: item, brand: mcdonalds)
end

%w(BigShot DoubleShot).each do |item|
  ::MenuItem.create(name: item, brand: burger_shot)
end

mcdonalds.locations.each do |loc|
  ::PriceLevel.create(
    amount: (0..100).to_a.sample,
    order_type: loc.order_types.sample,
    day_part: loc.day_parts.sample,
    menu_item: mcdonalds.menu_items.sample
  )
end

burger_shot.locations.each do |loc|
  ::PriceLevel.create(
    amount: (0..100).to_a.sample,
    order_type: loc.order_types.sample,
    day_part: loc.day_parts.sample,
    menu_item: burger_shot.menu_items.sample
  )
end

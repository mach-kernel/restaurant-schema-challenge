# frozen_string_literal: true
module API
  module Entities
    module Location
      include Roar::JSON
      include Roar::Hypermedia
      include Grape::Roar::Representer

      property :name

      link :self do |opts|
        Entities.format_link(opts, represented, self.class.name)
      end

      collection :order_types, extend: Entities::OrderType
      collection :day_parts, extend: Entities::DayPart
    end
  end
end

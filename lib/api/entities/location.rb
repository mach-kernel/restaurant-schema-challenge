# frozen_string_literal: true
module API
  module Entities
    module Location
      include Base

      link :self do |opts|
        Entities.format_link(opts, represented, self.class.name)
      end

      collection :order_types, extend: Entities::OrderType
      collection :day_parts, extend: Entities::DayPart
    end
  end
end

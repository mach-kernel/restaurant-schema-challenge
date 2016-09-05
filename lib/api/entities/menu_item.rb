# frozen_string_literal: true
module API
  module Entities
    module MenuItem
      include Base

      collection :price_levels, extend: Entities::PriceLevel
    end
  end
end

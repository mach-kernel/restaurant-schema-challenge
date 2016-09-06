# frozen_string_literal: true
module API
  module Entities
    module Brand
      include Base

      collection :locations, extend: Entities::Location
      collection :menu_items, extend: Entities::MenuItem
    end
  end
end

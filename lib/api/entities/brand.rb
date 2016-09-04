# frozen_string_literal: true
module API
  module Entities
    module Brand
      include Base

      collection :locations, extend: Entities::Location
    end
  end
end

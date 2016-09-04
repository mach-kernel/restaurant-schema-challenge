# frozen_string_literal: true
module API
  module Helpers
    module Location
      def location_params
        params do
          optional :name, type: String, desc: 'Location name'
          optional :id, type: String, desc: 'Location ID'
          optional :brand_id, type: String, desc: 'ID of Brand Parent'
        end
      end
    end
  end
end

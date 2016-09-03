# frozen_string_literal: true
module API
  module Helpers
    module Brand
      def brand_params
        params do
          optional :name, type: String, desc: 'Brand name'
          optional :id, type: String, desc: 'Brand ID'
        end
      end
    end
  end
end

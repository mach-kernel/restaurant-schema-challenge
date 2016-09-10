# frozen_string_literal: true
module API
  module Entities
    module OrderType
      include Base

      link :location do |opts|
        Entities.format_link(opts, represented.location, 'Location')
      end
    end
  end
end

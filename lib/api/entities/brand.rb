# frozen_string_literal: true
module API
  module Entities
    module Brand
      include Roar::JSON
      include Roar::Hypermedia
      include Grape::Roar::Representer

      property :name

      link :self do |opts|
        Entities.format_link(opts, represented, self.class.name)
      end

      collection :locations, extend: Entities::Location
    end
  end
end

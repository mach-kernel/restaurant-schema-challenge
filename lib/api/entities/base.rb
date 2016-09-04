# frozen_string_literal: true
module API
  module Entities
    module Base
      CONST_INCLUDES = [
        Roar::JSON,
        Roar::Hypermedia,
        Grape::Roar::Representer
      ]

      CONST_INCLUDES.each { |c| include c }


      property :name

      link :self do |opts|
        Entities.format_link(opts, represented, self.class.name)
      end

      def self.included(mod)
        mod.module_eval {
          CONST_INCLUDES.each { |c| include c }
        }
      end
    end
  end
end

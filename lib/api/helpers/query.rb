# frozen_string_literal: true
module API
  module Helpers
    module Query
      def find_or_raise(klass, fields = {}, *_args)
        klass.find(fields)
      rescue Mongoid::Errors::DocumentNotFound
        error!("#{klass} cannot be found", 404)
      end
    end
  end
end

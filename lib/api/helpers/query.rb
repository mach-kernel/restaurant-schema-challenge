# frozen_string_literal: true
module API
  module Helpers
    module Query
      def find_or_raise(klass, fields = {}, *_args)
        klass.find(fields)
      rescue Mongoid::Errors::DocumentNotFound
        error!("#{klass.name} cannot be found", 404)
      end

      def create_or_raise(klass, fields = {}, *_args)
        klass.create(fields)
      rescue Mongo::Error::OperationFailure
        error!("Cannot create #{klass.name}, invalid parameters", 400)
      end
    end
  end
end

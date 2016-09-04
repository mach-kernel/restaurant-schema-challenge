# frozen_string_literal: true
module API
  module Resources
    class Location < Grape::API
      extend Helpers::Location
      helpers Helpers::Query

      desc 'Create a brand'
      location_params
      params do
        requires :brand_id, type: String, desc: 'ID of Brand Parent'
      end
      post do
        status 201

        present(
          ::Location.create(
            declared(params).except('id')
          ), with: Entities::Location
        )
      end

      location_params
      route_param :id do
        desc 'Update a location'
        put do
          declared_params = declared(params).compact
          location = find_or_raise(::Location, declared_params.delete('id'))
          location.assign_attributes(declared_params)

          code = if location.changed?
                   location.save
                   204
                 else
                   304
                 end
          status(code)
        end

        desc 'Get a location'
        get do
          present(
            find_or_raise(::Location, (declared(params)[:id])),
            with: Entities::Location
          )
        end
      end

      get do
        present ::Location.all, with: Entities::List
      end
    end
  end
end

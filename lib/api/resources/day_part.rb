# frozen_string_literal: true
module API
  module Resources
    class DayPart < Grape::API
      include API::Helpers::Params
      helpers API::Helpers::Query

      desc 'Create a day part'
      day_part_params
      params do
        requires :location_id, type: String, desc: 'ID of Location Parent'
      end
      post do
        status 201

        present(
          ::DayPart.create(
            declared(params).except('id')
          ), with: Entities::DayPart
        )
      end

      day_part_params
      route_param :id do
        desc 'Update a location'
        put do
          declared_params = declared(params).compact
          day_part = find_or_raise(::DayPart, declared_params.delete('id'))
          day_part.assign_attributes(declared_params)

          code = if day_part.changed?
                   day_part.save
                   204
                 else
                   304
                 end
          status(code)
        end

        desc 'Get a day_part'
        get do
          present(
            find_or_raise(::DayPart, (declared(params)[:id])),
            with: Entities::DayPart
          )
        end

        desc 'Delete a DayPart'
        delete do
          remove_or_raise(::DayPart, (declared(params)[:id]))
        end
      end

      get do
        present ::DayPart.all, with: Entities::List
      end
    end
  end
end

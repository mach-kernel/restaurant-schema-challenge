# frozen_string_literal: true
module API
  module Resources
    class OrderType < Grape::API
      extend Helpers::OrderType
      helpers Helpers::Query

      desc 'Create an order_type'
      order_type_params
      params do
        requires :location_id, type: String, desc: 'ID of Location Parent'
      end
      post do
        status 201

        present(
          ::OrderType.create(
            declared(params).except('id')
          ), with: Entities::OrderType
        )
      end

      order_type_params
      route_param :id do
        desc 'Update a location'
        put do
          declared_params = declared(params).compact
          order_type = find_or_raise(::OrderType, declared_params.delete('id'))
          order_type.assign_attributes(declared_params)

          code = if order_type.changed?
                   order_type.save
                   204
                 else
                   304
                 end
          status(code)
        end

        desc 'Get an order type'
        get do
          present(
            find_or_raise(::OrderType, (declared(params)[:id])),
            with: Entities::OrderType
          )
        end
      end

      get do
        present ::OrderType.all, with: Entities::List
      end
    end
  end
end

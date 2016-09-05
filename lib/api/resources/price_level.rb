# frozen_string_literal: true
module API
  module Resources
    class PriceLevel < Grape::API
      include Helpers::Params
      helpers Helpers::Query

      desc 'Create a Price Level'
      price_level_params
      params do
        requires :menu_item_id, type: String, desc: 'ID of Menu Item Parent'
        requires :order_type_id, type: String, desc: 'ID of Order Type Parent'
      end
      post do
        status 201
        present(
          create_or_raise(
            ::PriceLevel,
            declared(params).except('id')
          ),
          with: Entities::PriceLevel
        )
      end

      price_level_params
      route_param :id do
        desc 'Update a Price Level'
        put do
          declared_params = declared(params).compact
          menu_item = find_or_raise(::PriceLevel, declared_params.delete('id'))
          menu_item.assign_attributes(declared_params)

          code = if menu_item.changed?
                   menu_item.save
                   204
                 else
                   304
                 end
          status(code)
        end

        desc 'Get a Price Level'
        get do
          present(
            find_or_raise(::PriceLevel, (declared(params)[:id])),
            with: Entities::PriceLevel
          )
        end
      end

      get do
        present ::PriceLevel.all, with: Entities::List
      end
    end
  end
end

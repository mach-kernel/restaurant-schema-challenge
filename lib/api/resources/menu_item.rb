# frozen_string_literal: true
module API
  module Resources
    class MenuItem < Grape::API
      include API::Helpers::Params
      helpers API::Helpers::Query

      desc 'Create a menu item'
      menu_item_params
      params do
        requires :brand_id, type: String, desc: 'ID of Brand Parent'
      end
      post do
        status 201

        present(
          ::MenuItem.create(
            declared(params).except('id')
          ), with: Entities::MenuItem
        )
      end

      menu_item_params
      route_param :id do
        desc 'Update a menu item'
        put do
          declared_params = declared(params).compact
          menu_item = find_or_raise(::MenuItem, declared_params.delete('id'))
          menu_item.assign_attributes(declared_params)

          code = if menu_item.changed?
                   menu_item.save
                   204
                 else
                   304
                 end
          status(code)
        end

        desc 'Get a menu item'
        get do
          present(
            find_or_raise(::MenuItem, (declared(params)[:id])),
            with: Entities::MenuItem
          )
        end

        desc 'Get the applicable price'
        params do
          requires :order_type_id, type: String, desc: 'Order Type ID'
          optional :day_part_id, type: String, desc: 'Day Part ID, if present'
        end
        get '/price' do
          declared_params = declared(params)
          item = find_or_raise(::MenuItem, declared_params.delete('id'))

          present(
            item
              .price_levels
              .retrieve_pricing(declared_params), with: Entities::PriceLevel
          )
        end

        desc 'Delete a MenuItem'
        delete do
          remove_or_raise(::MenuItem, (declared(params)[:id]))
        end
      end

      get do
        present ::MenuItem.all, with: Entities::List
      end
    end
  end
end

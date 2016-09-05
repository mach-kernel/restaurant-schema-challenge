# frozen_string_literal: true
module API
  module Resources
    class MenuItem < Grape::API
      include Helpers::Params
      helpers Helpers::Query

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
      end

      get do
        present ::MenuItem.all, with: Entities::List
      end
    end
  end
end

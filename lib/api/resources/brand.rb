# frozen_string_literal: true
module API
  module Resources
    class Brand < Grape::API
      include API::Helpers::Params
      helpers API::Helpers::Query

      desc 'Create a brand'
      brand_params
      post do
        status 201

        present(
          ::Brand.create(name: declared(params)[:name]), with: Entities::Brand
        )
      end

      brand_params
      route_param :id do
        desc 'Update a brand'
        put do
          declared_params = declared(params)
          brand = find_or_raise(::Brand, declared_params.delete(:id))
          brand.assign_attributes(declared_params)

          code = if brand.changed?
                   brand.save
                   204
                 else
                   304
                 end
          status(code)
        end

        desc 'Get a brand'
        get do
          present(
            find_or_raise(::Brand, (declared(params)[:id])),
            with: Entities::Brand
          )
        end

        desc 'Delete a brand'
        delete do
          remove_or_raise(::Brand, (declared(params)[:id]))
        end
      end

      get do
        present ::Brand.all, with: Entities::List
      end
    end
  end
end

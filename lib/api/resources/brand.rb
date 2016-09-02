# frozen_string_literal: true
module API
  module Resources
    class Brand < Grape::API
      extend Helpers::Brand

      desc 'Create a brand'
      brand_params
      post do
        status 201

        present(
          ::Brand.create(name: declared(params)[:name]), with: Entities::Brand
        )
      end

      desc 'Update a brand'
      brand_params
      route_param :id do
        put do
          declared_params = declared(params)
          brand = begin
            ::Brand.find(declared_params.delete(:id))
          rescue Mongoid::Errors::DocumentNotFound
            error!('Brand not found', 404)
          end

          brand.assign_attributes(declared_params)
          code = if brand.changed?
            brand.save
            204
          else
            304
          end
          status(code)
        end
      end
    end
  end
end

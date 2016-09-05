# frozen_string_literal: true
module API
  module Helpers
    module Params
      # rubocop:disable Metrics/MethodLength, Metrics/AbcSize,
      # rubocop:disable Metrics/CyclomaticComplexity
      def self.included(mod, *_args)
        mod.instance_eval do
          def method_missing(sym, *_args, &_block)
            return super unless sym.to_s.include?('_params')

            klass = sym.to_s.split('_params').first.classify
            extract_associations(klass)
            extract_fields(klass)
          end

          def respond_to_missing?(sym, respond_private = false)
            sym.to_s.include?('_params') || super
          end

          def extract_fields(klass)
            klass.constantize.fields.each_pair do |key, attrs|
              next if %w(created_at updated_at).include?(key)
              type = attrs.options.fetch(:type)
              next if type == Object

              key = 'id' if key == '_id'
              params do
                optional(key, type: type || String,
                              desc: "#{self.class.name} #{key}")
              end
            end
          end

          def extract_associations(klass)
            klass
              .constantize
              .reflect_on_all_associations(:belongs_to)
              .each do |rel|
                params do
                  optional rel.key, type: String, desc: "ID of #{klass} parent"
                end
              end
          end
        end
        # rubocop:enable Metrics/MethodLength, Metrics/AbcSize,
        # rubocop:enable Metrics/CyclomaticComplexity
      end
    end
  end
end

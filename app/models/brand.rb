# frozen_string_literal: true
class Brand
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String

  %i(locations menu_items).each { |m| has_many m }
end

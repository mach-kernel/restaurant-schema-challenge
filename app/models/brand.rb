# frozen_string_literal: true
class Brand
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
end

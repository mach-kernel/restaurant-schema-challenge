# frozen_string_literal: true
class MenuItem
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
end

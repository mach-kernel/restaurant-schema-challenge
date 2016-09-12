# frozen_string_literal: true
class MenuItem
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String

  belongs_to :brand

  has_many :price_levels, dependent: :destroy do
    def retrieve_pricing(query = {})
      where(query).first
    end
  end
end

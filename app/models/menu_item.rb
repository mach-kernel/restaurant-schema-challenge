# frozen_string_literal: true
class MenuItem
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String

  belongs_to :brand
  has_many :price_levels, dependent: :destroy do
    def retrieve_pricing(order_type, day_part = nil)
      query = {
        order_type: order_type,
        day_part: day_part
      }.select! { |_k, v| v.present? }
      where(query).first
    end
  end
end

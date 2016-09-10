var Button = app.ReactBootstrap.Button;
var Panel = app.ReactBootstrap.Panel;
var Accordion = app.ReactBootstrap.Accordion;

var MealBuilder = React.createClass({

  getInitialState: function() {
    return {    
      brands: undefined,
      current_brand: undefined,
      current_location: undefined,
      current_order_type: undefined,
      current_day_part: undefined,
      default_active_key: '1',
      price: undefined
    };
  },

  loadBrandTree: function() {
    $.ajax(app.getUrl(location, 'brand'), {
      success: function(data) {
        var brands = [];

        data.links.forEach(function(resource) {

          if (resource.rel === 'self') { return; }
          resource.href.forEach(function(href) {
            $.ajax(href, {
              success: function(record) {
                brands.push(record);

                this.setState({brands: brands});
              }.bind(this)
            });
          }.bind(this));

        }.bind(this));

      }.bind(this)
    })
  },

  populateBrandSelect: function() {
    if (this.state.brands === undefined) { return null; }
    return this.state.brands.map(function(brand) {
      return <option value={brand.links[0].href}>{brand.name}</option>;
    });
  },

  fetchCurrentBrand: function() {
    if (this.state.current_brand === undefined) { return null; }
    return this.state.brands.filter(function(brand) {
      return brand.links[0].href === this.state.current_brand;
    }.bind(this))[0];
  },

  fetchCurrentLocation: function() {
    if (this.state.current_location === undefined) { return null; }
    return this.fetchCurrentBrand().locations.filter(function(location) {
      return location.links[0].href === this.state.current_location;
    }.bind(this))[0];
  },

  populateLocationSelect: function() {
    if (this.fetchCurrentBrand() === null) { return null; }
    return this.fetchCurrentBrand().locations.map(function(location) {
      return <option value={location.links[0].href}>{location.name}</option>;
    }.bind(this));
  },

  populateOrderTypeSelect: function() {
    if (this.fetchCurrentLocation() === null) { return null; }
    return this.fetchCurrentLocation().order_types.map(function(order_types) {
      return <option value={order_types.links[0].href}>{order_types.name}</option>;
    }.bind(this));
  },

  populateDayPartSelect: function() {
    if (this.fetchCurrentLocation() === null) { return null; }
    return this.fetchCurrentLocation().day_parts.map(function(day_parts) {
      return <option value={day_parts.links[0].href}>{day_parts.name}</option>;
    }.bind(this));
  },

  populateMenuItemSelect: function() {
    if (this.fetchCurrentBrand() === null) { return null; }
    return this.fetchCurrentBrand().menu_items.map(function(menu_item) {

      price_order_type = menu_item.price_levels.map(function(price_level){ 
        return price_level.links.filter(function(link){
          return link.rel === 'order_type';
        })[0];
      });

      has_prices = price_order_type.filter(function(order_link) {
        return order_link.href === this.state.current_order_type;
      }.bind(this));
      if (has_prices.length > 0) {
        return <option value={menu_item.links[0].href}>{menu_item.name}</option>;
      }
    }.bind(this));
  },

  componentWillMount: function() {
    this.loadBrandTree();
  },

  updateCurrentBrand: function(e) {
    this.setState({
      current_brand: e.target.value,
      default_active_key: "2"
    });
  },

  updateCurrentLocation: function(e) {
    this.setState({
      current_location: e.target.value,
      default_active_key: "3"
    });
  },

  updateCurrentOrderType: function(e) {
    this.setState({
      current_order_type: e.target.value,
      default_active_key: "4"
    });
  },

  updateCurrentDayPart: function(e) {
    this.setState({
      current_day_part: e.target.value,
      default_active_key: "5"
    });
  },

  retrievePricing: function(e) {
    day_part_id = (this.state.day_part_id === undefined) ? null : this.state.current_day_part.split('/').pop();

    $.ajax({
      url: e.target.value + '/price',
      data: {
        order_type_id: this.state.current_order_type.split('/').pop(),
        day_part_id: day_part_id     
      },
      statusCode: {
        200: function(data) {
          this.setState({price: data});
        }.bind(this),
        404: function(_err) { alert('Probably no pricing for this item'); }
      }
    });
  },

  render: function() {
    return(
      <div>
        <Button
          className="btn-block"
          bsStyle="default"
          bsSize="sm"
          onClick={
            function() {
              location.reload();
            }
          }
        >
          Start Over?
        </Button>
        <br />
        <Accordion defaultActiveKey={this.state.default_active_key} activeKey={this.state.default_active_key}>
          <Panel header="Pick a restaurant" eventKey="1">
            <div className="col-md-12">
              <FormControl
                id="brand_select"
                componentClass="select"
                onChange={this.updateCurrentBrand}
              >
                <option value="placeholder">Make a selection...</option>
                {this.populateBrandSelect()}
              </FormControl>
            </div>
          </Panel>
          <Panel header="Pick a location" eventKey="2">
            <div className="col-md-12">
              <FormControl
                id="location_select"
                componentClass="select"
                onChange={this.updateCurrentLocation}
              >
                <option value="placeholder">Make a selection...</option>
                {this.populateLocationSelect()}
              </FormControl>
            </div>
          </Panel>
          <Panel header="Pick your order type" eventKey="3">
            <div className="col-md-12">
              <FormControl
                id="order_type_select"
                componentClass="select"
                onChange={this.updateCurrentOrderType}
              >
                <option value="placeholder">Make a selection...</option>
                {this.populateOrderTypeSelect()}
              </FormControl>
            </div>
          </Panel>
          <Panel header="Pick a time (optional)" eventKey="4">
            <div className="col-md-12">
              <FormControl
                id="day_part_select"
                componentClass="select"
                onChange={this.updateCurrentDayPart}
              >
                <option value="placeholder">Make a selection...</option>
                {this.populateDayPartSelect()}
              </FormControl>
              <br />
              <Button
                bsStyle="primary"
                bsSize="sm"
                onClick={
                  function() {
                    this.setState({default_active_key: "5"});
                  }.bind(this)
                }
              >
                Skip?
              </Button>
            </div>
          </Panel>
          <Panel header="What would you like?" eventKey="5">
            <div className="col-md-12">
              <FormControl
                id="menu_item_select"
                componentClass="select"
                onChange={this.retrievePricing}
              >
                <option value="placeholder">Make a selection...</option>
                {
                  function() {
                    var items = this.populateMenuItemSelect();
                    if (items === null) { return null; }
                    console.log(items);
                    if (items.length > 0) { return items; }
                    else { return <option value="nothing">Sorry! No Applicable Items </option> }
                  }.bind(this)()
                }
              </FormControl>
              <br />
              <strong>
                {
                  function(){
                    if (this.state.price !== undefined) {
                      return <p>{this.state.price.name}: <em>${this.state.price.amount}</em></p>
                    }
                  }.bind(this)()
                }
              </strong>
            </div>
          </Panel>
        </Accordion>
      </div>
    );
  }
});

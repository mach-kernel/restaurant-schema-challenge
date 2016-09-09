var Button = app.ReactBootstrap.Button;
var Col = app.ReactBootstrap.Col;
var ControlLabel = app.ReactBootstrap.ControlLabel;
var Form = app.ReactBootstrap.Form;
var FormControl = app.ReactBootstrap.FormControl;
var FieldGroup = app.ReactBootstrap.FieldGroup;
var Modal = app.ReactBootstrap.Modal;
var OverlayTrigger = app.ReactBootstrap.OverlayTrigger;
var Tooltip = app.ReactBootstrap.Tooltip;

var Table = app.ReactBootstrap.Table;

var PriceLevelModal = React.createClass({

  propTypes: {
    price_levels: React.PropTypes.array,
    locations: React.PropTypes.array,
    parentId: React.PropTypes.string,
    notifyParent: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      price_levels: this.props.price_levels,
      locations: this.props.locations,
      show_placeholder: true,
      amount: undefined,
      current_location: undefined,
      order_type: undefined,
      day_part: undefined
    };
  },

  close: function() { this.setState({ showModal: false })},
  
  create: function() {
    day_part_id = (this.state.day_part !== undefined) ? this.state.day_part.split('/').pop() : undefined;

    request = {
      amount: this.state.amount,
      menu_item_id: this.props.parentId,
      order_type_id: this.state.order_type.split('/').pop(),
      day_part_id: day_part_id,
      location_id: this.state.current_location.split('/').pop()
    };

    this.setState({show_placeholder: true});

    $.ajax({
      method: 'post',
      url: app.getUrl(location, 'price_level'), 
      data: request,
      dataType: 'json',
      statusCode: {
        201: function(data) {
                new_collection = this.state.price_levels;
                new_collection.push(data);
                this.setState({price_levels: new_collection});
                this.props.notifyParent(data);
              }.bind(this),
        400: function(err) {
          alertText = 
            (err.responseJSON.error.includes('Cannot create')) ? 
              'There already exists a pricing for this (location, order type) '
              + 'or (location, order type, day part). To replace an existing record, '
              + 'please delete it.' : 'Invalid Parameters';

          alert(alertText);
        }
      }});

    this.setState({
      current_location: undefined,
      order_type: undefined,
      day_part: undefined
    });

    $('#location_select').val('placeholder');
    $('#ot_select').val([]);
    $('#dp_select').val([]);
    $('#amount_field').val('');
  },

  open: function() { this.setState({ showModal: true })},

  removeFromCollection: function(url) {
    this.setState({
      price_levels: this.state.price_levels.map(function(item) {
        if (typeof item === 'object') {
          if (item.links[0].href === url) { return; }
          return item;          
        }
      }.bind(this))
    });
    this.props.notifyParent();
  },

  updateCurrentLocation: function(e) {
    this.setState({
      current_location: e.target.value,
      show_placeholder: false
    });
  },

  updateOrderType: function(e) {
    this.setState({
      order_type: e.target.value
    });
  },

  updateDayPart: function(e) {
    this.setState({
      day_part: e.target.value
    });
  },

  updateAmountField: function(e) {
    this.setState({
      amount: e.target.value
    });
  },

  validOrderTypes: function() {
    var valid_locations = this.state.locations.filter(function(location) {
      return location.links[0].href === this.state.current_location;
    }.bind(this));

    if (this.state.order_type === undefined) {
      if (valid_locations.length > 0) {      
        this.setState({order_type: valid_locations[0].order_types[0].links[0].href});
      }
    }

    return (valid_locations.length > 0) ? valid_locations[0].order_types : [];
  },

  validDayParts: function() {
    var valid_locations = this.state.locations.filter(function(location) {
      return location.links[0].href === this.state.current_location;
    }.bind(this));

    if (this.state.day_part === undefined) {
      if (valid_locations.length > 0) {      
        this.setState({day_part: valid_locations[0].day_parts[0].links[0].href});
      }
    }

    return (valid_locations.length > 0) ? valid_locations[0].day_parts : [];
  },

  render: function() {
    return(
      <div>
        <div className="col-xs-2">
          <Button
            bsStyle="primary"
            bsSize="sm"
            onClick={this.open}
          >
            Manage Pricing Associations
          </Button>
        </div>

        <Modal bsSize="large" show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>
              Manage Pricing Associations
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
          <h5>Add Pricings</h5>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Location</th>
                <th>Amount</th>
                <th>Order Type</th>
                <th>Day Part (optional)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> 
                  <FormControl
                    id="location_select"
                    componentClass="select"
                    className="input-sm"
                    onChange={this.updateCurrentLocation}
                  >
                    {
                      function() {
                        if (this.state.show_placeholder === true) {
                          return(<option value="placeholder"></option>);
                        }
                      }.bind(this)()
                    }
                    {
                      this.state.locations.map(function(location) {
                        if (typeof location === 'object') {
                          return(
                            <option value={location.links[0].href}>{location.name}</option>
                          );        
                        }
                      }.bind(this))
                    }
                  </FormControl>
                </td>
                <td>
                  <FormControl
                    id="amount_field"
                    type="text"
                    placeholder="e.g. 8.99"
                    className="input-sm"
                    onChange={this.updateAmountField}
                  />    
                </td>
                <td> 
                  <FormControl
                    id="ot_select"
                    componentClass="select"
                    className="input-sm"
                    onChange={this.updateOrderType}
                  >
                  {
                    this.validOrderTypes().map(
                      function(order_type) {
                        if (typeof order_type === 'object') {
                          return(
                            <option value={order_type.links[0].href}>{order_type.name}</option>
                          );        
                        }
                      }
                    )
                  }
                  </FormControl>
                </td>
                <td> 
                  <FormControl
                    id="dp_select"
                    componentClass="select"
                    className="input-sm"
                    onChange={this.updateDayPart}
                  >
                  {
                    this.validDayParts().map(
                      function(day_part) {
                        if (typeof day_part === 'object') {
                          return(
                            <option value={day_part.links[0].href}>{day_part.name}</option>
                          );        
                        }
                      }
                    )
                  }
                  </FormControl>
                </td>
                <td>
                  <Button
                    className="btn-block"
                    bsStyle="success"
                    bsSize="sm"
                    onClick={this.create}
                  >Save</Button>
                </td>
              </tr>
            </tbody>
          </Table>
          <hr />
          <h5>Remove Pricings</h5>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>Location</th>
                <th>Amount</th>
                <th>Order Type</th>
                <th>Day Part (optional)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.price_levels.map(function(item) {
                  if (typeof item === 'object') {
                    return(
                      <PriceLevelRow
                        key={item.links[0].href}
                        entity={item}
                        notifyParent={this.removeFromCollection}
                      />
                    );
                  } else { return(null); }
                }.bind(this))
              }
            </tbody>
          </Table>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
});

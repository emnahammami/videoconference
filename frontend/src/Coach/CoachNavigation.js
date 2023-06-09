import React from "react";

// reactstrap components
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,UncontrolledTooltip
 
} from "reactstrap";
import { logout } from "../redux/Action/authAction";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Logo from "../assets/img/logo.png"

export default function CoachNavigation() {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [collapseOpen, setCollapseOpen] = React.useState(false);

  return (
    <Navbar className="bg-primary" expand="lg">
    <Container>
                <div className="navbar-translate">
                <NavbarBrand
              
              target="_blank"
              id="navbar-brand"
            >
                <img
          variant="top" 
          src={Logo} alt="okk" style={ {height: " 70px ", width: "70px"}}
        />
            </NavbarBrand>
            <UncontrolledTooltip target="#navbar-brand">
              Designed by Coders Breed
            </UncontrolledTooltip>
        <NavbarBrand
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          <h5>Beat Bounce & Score</h5>
        </NavbarBrand>

                  <button
                    onClick={() => {
                      document.documentElement.classList.toggle("nav-open");
                      setCollapseOpen(!collapseOpen);
                    }}
                    aria-expanded={collapseOpen}
                    className="navbar-toggler"
                    type="button"
                  >
                    <span className="navbar-toggler-bar bar1"></span>
                    <span className="navbar-toggler-bar bar2"></span>
                    <span className="navbar-toggler-bar bar3"></span>
                  </button>
                </div>
                <Collapse isOpen={collapseOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem >
                      <NavLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="now-ui-icons objects_globe"></i>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                         onClick={() => {
                          navigate("/profile");
                          window.location.reload()
                        }} 
                      >
                        <i className="now-ui-icons users_circle-08"></i>
                      </NavLink>
                    </NavItem>

                    <UncontrolledDropdown nav>
                        <DropdownToggle
                          aria-haspopup={true}
                          caret
                          color="default"
                          nav
                        >
                          <i aria-hidden="true" class="now-ui-icons ui-1_settings-gear-63"></i>
                          <p>Settings</p>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={() => {
                              dispatch(logout());
                              navigate("/");
                              window.location.reload()
                            }} 
                          >
                            <i className="now-ui-icons arrows-1_share-66 mr-1"></i>
                              Logout
                          </DropdownItem>
                    
      
                        </DropdownMenu>
              </UncontrolledDropdown>
                  </Nav>
                </Collapse>
              </Container>
  </Navbar>
  )
}

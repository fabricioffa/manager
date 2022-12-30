import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
  faFileContract, faPhone, faExclamation, faHouseChimneyWindow, faUser, faCirclePlus, faCircleMinus,
  faLeftLong, faCalendarDay, faDroplet, faBolt, faLocationDot, faCircleDollarToSlot, faMagnifyingGlass,
  faCaretRight, faCaretLeft 
} from '@fortawesome/free-solid-svg-icons';

// import {

// } from '@fortawesome/free-regular-svg-icons';

// import {

// } from '@fortawesome/free-brands-svg-icons';

library.add(
  faPhone, faFileContract, faExclamation, faHouseChimneyWindow, faUser, faCirclePlus, faCircleMinus,
  faLeftLong, faCalendarDay, faDroplet, faBolt, faLocationDot, faCircleDollarToSlot, faMagnifyingGlass,
  faCaretRight, faCaretLeft 
  );

dom.watch()

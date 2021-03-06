var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { CordovaInstance, InstanceProperty, Plugin, getPromise } from './plugin';
/**
 * @private
 */
export var Contact = (function () {
    function Contact() {
        this._objectInstance = navigator.contacts.create();
    }
    Contact.prototype.clone = function () {
        var newContact = new Contact();
        for (var prop in this) {
            if (prop === 'id')
                return;
            newContact[prop] = this[prop];
        }
        return newContact;
    };
    Contact.prototype.remove = function () { return; };
    Contact.prototype.save = function () {
        var _this = this;
        return getPromise(function (resolve, reject) {
            _this._objectInstance.save(function (contact) {
                _this._objectInstance = contact;
                resolve(_this);
            }, reject);
        });
    };
    __decorate([
        InstanceProperty
    ], Contact.prototype, "id", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "displayName", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "name", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "nickname", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "phoneNumbers", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "emails", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "addresses", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "ims", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "organizations", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "birthday", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "note", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "photos", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "categories", void 0);
    __decorate([
        InstanceProperty
    ], Contact.prototype, "urls", void 0);
    __decorate([
        CordovaInstance()
    ], Contact.prototype, "remove", null);
    return Contact;
}());
/**
 * @private
 */
export var ContactName = (function () {
    function ContactName(formatted, familyName, givenName, middleName, honorificPrefix, honorificSuffix) {
        this.formatted = formatted;
        this.familyName = familyName;
        this.givenName = givenName;
        this.middleName = middleName;
        this.honorificPrefix = honorificPrefix;
        this.honorificSuffix = honorificSuffix;
    }
    return ContactName;
}());
/**
 * @private
 */
export var ContactField = (function () {
    function ContactField(type, value, pref) {
        this.type = type;
        this.value = value;
        this.pref = pref;
    }
    return ContactField;
}());
/**
 * @private
 */
export var ContactAddress = (function () {
    function ContactAddress(pref, type, formatted, streetAddress, locality, region, postalCode, country) {
        this.pref = pref;
        this.type = type;
        this.formatted = formatted;
        this.streetAddress = streetAddress;
        this.locality = locality;
        this.region = region;
        this.postalCode = postalCode;
        this.country = country;
    }
    return ContactAddress;
}());
/**
 * @private
 */
export var ContactOrganization = (function () {
    function ContactOrganization(type, name, department, title, pref) {
        this.type = type;
        this.name = name;
        this.department = department;
        this.title = title;
        this.pref = pref;
    }
    return ContactOrganization;
}());
/**
 * @private
 */
export var ContactFindOptions = (function () {
    function ContactFindOptions(filter, multiple, desiredFields, hasPhoneNumber) {
        this.filter = filter;
        this.multiple = multiple;
        this.desiredFields = desiredFields;
        this.hasPhoneNumber = hasPhoneNumber;
    }
    return ContactFindOptions;
}());
/**
 * @name Contacts
 * @description
 * Access and manage Contacts on the device.
 *
 * @usage
 *
 * ```typescript
 * import { Contacts, Contact, ContactField, ContactName } from 'ionic-native';
 *
 *
 * let contact: Contact = Contacts.create();
 *
 * contact.name = new ContactName(null, 'Smith', 'John');
 * contact.phoneNumbers = [new ContactField('mobile', '6471234567')];
 * contact.save().then(
 *   () => console.log('Contact saved!', contact),
 *   (error: any) => console.error('Error saving contact.', error)
 * );
 *
 * ```
 * @interfaces
 * IContactProperties
 * IContactError
 * IContactName
 * IContactField
 * IContactAddress
 * IContactOrganization
 * IContactFindOptions
 */
export var Contacts = (function () {
    function Contacts() {
    }
    /**
     * Create a single contact.
     * @returns {Contact} Returns a Contact object
     */
    Contacts.create = function () {
        return new Contact();
    };
    /**
     * Search for contacts in the Contacts list.
     * @param fields {ContactFieldType[]}  Contact fields to be used as a search qualifier
     * @param options {IContactFindOptions} Optional options for the query
     * @returns {Promise<Contact[]>} Returns a Promise that resolves with the search results (an array of Contact objects)
     */
    Contacts.find = function (fields, options) {
        return getPromise(function (resolve, reject) {
            navigator.contacts.find(fields, function (contacts) {
                resolve(contacts.map(processContact));
            }, reject, options);
        });
    };
    /**
     * Select a single Contact.
     * @returns {Promise<Contact>} Returns a Promise that resolves with the selected Contact
     */
    Contacts.pickContact = function () {
        return getPromise(function (resolve, reject) {
            navigator.contacts.pickContact(function (contact) { return resolve(processContact(contact)); }, reject);
        });
    };
    Contacts = __decorate([
        Plugin({
            pluginName: 'Contacts',
            plugin: 'cordova-plugin-contacts',
            pluginRef: 'navigator.contacts',
            repo: 'https://github.com/apache/cordova-plugin-contacts'
        })
    ], Contacts);
    return Contacts;
}());
/**
 * @private
 */
function processContact(contact) {
    var newContact = new Contact();
    for (var prop in contact) {
        if (typeof contact[prop] === 'function')
            continue;
        newContact[prop] = contact[prop];
    }
    return newContact;
}
//# sourceMappingURL=contacts.js.map
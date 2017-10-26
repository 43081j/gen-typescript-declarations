declare namespace Polymer {

  /**
   * Element class mixin that provides the core API for Polymer's meta-programming
   * features including template stamping, data-binding, attribute deserialization,
   * and property change observation.
   * 
   * Subclassers may provide the following static getters to return metadata
   * used to configure Polymer's features for the class:
   * 
   * - `static get is()`: When the template is provided via a `dom-module`,
   *   users should return the `dom-module` id from a static `is` getter.  If
   *   no template is needed or the template is provided directly via the
   *   `template` getter, there is no need to define `is` for the element.
   * 
   * - `static get template()`: Users may provide the template directly (as
   *   opposed to via `dom-module`) by implementing a static `template` getter.
   *   The getter may return an `HTMLTemplateElement` or a string, which will
   *   automatically be parsed into a template.
   * 
   * - `static get properties()`: Should return an object describing
   *   property-related metadata used by Polymer features (key: property name
   *   value: object containing property metadata). Valid keys in per-property
   *   metadata include:
   *   - `type` (String|Number|Object|Array|...): Used by
   *     `attributeChangedCallback` to determine how string-based attributes
   *     are deserialized to JavaScript property values.
   *   - `notify` (boolean): Causes a change in the property to fire a
   *     non-bubbling event called `<property>-changed`. Elements that have
   *     enabled two-way binding to the property use this event to observe changes.
   *   - `readOnly` (boolean): Creates a getter for the property, but no setter.
   *     To set a read-only property, use the private setter method
   *     `_setProperty(property, value)`.
   *   - `observer` (string): Observer method name that will be called when
   *     the property changes. The arguments of the method are
   *     `(value, previousValue)`.
   *   - `computed` (string): String describing method and dependent properties
   *     for computing the value of this property (e.g. `'computeFoo(bar, zot)'`).
   *     Computed properties are read-only by default and can only be changed
   *     via the return value of the computing method.
   * 
   * - `static get observers()`: Array of strings describing multi-property
   *   observer methods and their dependent properties (e.g.
   *   `'observeABC(a, b, c)'`).
   * 
   * The base class provides default implementations for the following standard
   * custom element lifecycle callbacks; users may override these, but should
   * call the super method to ensure
   * - `constructor`: Run when the element is created or upgraded
   * - `connectedCallback`: Run each time the element is connected to the
   *   document
   * - `disconnectedCallback`: Run each time the element is disconnected from
   *   the document
   * - `attributeChangedCallback`: Run each time an attribute in
   *   `observedAttributes` is set or removed (note: this element's default
   *   `observedAttributes` implementation will automatically return an array
   *   of dash-cased attributes based on `properties`)
   */
  function ElementMixin<T extends new(...args: any[]) => {}>(base: T): {
    new(...args: any[]): {
      _template: HTMLTemplateElement|null;
      _importPath: string;
      rootPath: string;
      importPath: string;
      root: StampedTemplate|null|HTMLElement|null|ShadowRoot|null;
      $: any;

      /**
       * Provides a default implementation of the standard Custom Elements
       * `attributeChangedCallback`.
       * 
       * By default, attributes declared in `properties` metadata are
       * deserialized using their `type` information to properties of the
       * same name.  "Dash-cased" attributes are deserialized to "camelCase"
       * properties.
       */
      attributeChangedCallback(name: string, old: string|null, value: string|null): any;

      /**
       * Overrides the default `Polymer.PropertyAccessors` to ensure class
       * metaprogramming related to property accessors and effects has
       * completed (calls `finalize`).
       * 
       * It also initializes any property defaults provided via `value` in
       * `properties` metadata.
       */
      _initializeProperties(): any;

      /**
       * Stamps the element template.
       */
      ready(): any;

      /**
       * Implements `PropertyEffects`'s `_readyClients` call. Attaches
       * element dom by calling `_attachDom` with the dom stamped from the
       * element's template via `_stampTemplate`. Note that this allows
       * client dom to be attached to the element prior to any observers
       * running.
       */
      _readyClients(): any;

      /**
       * Provides a default implementation of the standard Custom Elements
       * `connectedCallback`.
       * 
       * The default implementation enables the property effects system and
       * flushes any pending properties, and updates shimmed CSS properties
       * when using the ShadyCSS scoping/custom properties polyfill.
       */
      connectedCallback(): any;

      /**
       * Provides a default implementation of the standard Custom Elements
       * `disconnectedCallback`.
       */
      disconnectedCallback(): any;

      /**
       * Attaches an element's stamped dom to itself. By default,
       * this method creates a `shadowRoot` and adds the dom to it.
       * However, this method may be overridden to allow an element
       * to put its dom in another location.
       */
      _attachDom(dom: StampedTemplate|null): ShadowRoot|null;

      /**
       * When using the ShadyCSS scoping and custom property shim, causes all
       * shimmed styles in this element (and its subtree) to be updated
       * based on current custom property values.
       * 
       * The optional parameter overrides inline custom property styles with an
       * object of properties where the keys are CSS properties, and the values
       * are strings.
       * 
       * Example: `this.updateStyles({'--color': 'blue'})`
       * 
       * These properties are retained unless a value of `null` is set.
       */
      updateStyles(properties?: Object|null): any;

      /**
       * Rewrites a given URL relative to a base URL. The base URL defaults to
       * the original location of the document containing the `dom-module` for
       * this element. This method will return the same URL before and after
       * bundling.
       */
      resolveUrl(url: string, base?: string): string;
    }
  } & T
}
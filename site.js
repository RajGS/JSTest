define("dpz.layout", function() {
    function a(a) {
        var b = {};
        b.compiledFunc = a;
        b.assembleWith = function(a) {
            var b = "", g, c;
            if (a instanceof Array) {
                g = a.length;
                for (c = 0; c < g; c++)
                    b += this.compiledFunc(a[c])
            } else
                b += this.compiledFunc(a);
            console.log("b.assembleWith.b = " + b);
            return b
        };
        return b
    }
    var b = {};
    $.extend(b, {create: function(b) {
            return new a(b)
        }});
    return b
});
define("dpz.template", ["dpz.config", "dpz.layout", "dpz.JST", "marketjs/override.templates"], function(a, b, c) {
    var d = {}, f = {}, e = {}, g = {}, h = {};
    Handlebars.registerHelper("t", function(a, g) {
        return new Handlebars.SafeString(h.translate(a, g))
    });
    Handlebars.registerHelper("tt", function(a, g, b) {
        return new Handlebars.SafeString(h.transformAndTranslate(a, g, b))
    });
    Handlebars.registerHelper("market", function(a) {
        return dpz.market[a] || ""
    });
    Handlebars.registerHelper("makeLink", function(a) {
        return a.indexOf("/") === 0 ? urlConfig.root + 
        a : a
    });
    Handlebars.registerHelper("killConfig", function(a, g) {
        return killConfig.isMarketEnabled(a) ? g.fn(this) : g.inverse(this)
    });
    Handlebars.registerHelper("prt", function(a, g) {
        return a ? new Handlebars.SafeString(h.get(a).compiledFunc(g.data.root ? g.data.root : h.contextFixed)) : null
    });
    Handlebars.registerHelper("money", function(a) {
        return !isNaN(parseFloat(a)) ? h.translateMoney(a) : a == "Free" ? h.translate("confirmation.free") : ""
    });
    $.extend(h, {loadConfig: function(b) {
            e = b.getMarketProperty("numbers");
            f = {};
            window.i18n = 
            g = b.getLanguageStrings();
            a = b
        },get: function(a) {
            d[a] || (d[a] = b.create(h.getJST(a)));
            return typeof d[a].compiledFunc == "function" ? d[a] : false
        },getJST: function(a) {
            return c && c.overrides && c.overrides[a] || c[a]
        },isTemplateObj: function(a) {
            return a && typeof a === "object" && a.component && a.tokens
        },transformAndTranslate: function(a, g, b) {
            return h.translate([a, g.split(/\s+/).join("_")].join(".").toLowerCase(), b)
        },translate: function(a, b) {
            var e = DEBUG && '<span style="text-shadow: 1px 1px 1px purple; color: limegreen; font-weight: bold">Translation Missing:' + 
            a + "</span>" || a;
            if (g) {
                if (f[a] === void 0 || typeof f[a] !== "function")
                    g[a] === void 0 ? console && DEBUG && console.log('DEBUG : TEMPLATES : No translation for "' + a + '".') : f[a] = g[a];
                try {
                    b = b ? b.data && b.data.root || b : {}, e = f[a](b)
                } catch (c) {
                    console && DEBUG && console.log('DEBUG : TEMPLATES : TRANSLATE ERROR "' + a + '".')
                }
            }
            return e
        },setValidator: function(g) {
            var b = a.getMarketProperty("errorsValidator"), e;
            for (e in b)
                g.messages[e] = b[e]
        },translateError: function(g, b) {
            var e = dpz.template.contextFixed, f = a.getMarketProperty("errors"), 
            c, b = $.isArray(b) ? b : [b];
            if (f[g]) {
                for (c = 0, f = b.length; c < f; c++)
                    e["val" + (c + 1)] = b[c];
                return h.translate("errors." + g, e)
            }
            return g
        },translateMoney: function(a) {
            return h.formatMoney(a, e)
        },formatMoney: function(a, g) {
            if (a) {
                var a = parseFloat(a.toString().replace(",", "")), b = g.currency_symbol || "$", e = isNaN(g.money_digits_after_decimal = Math.abs(g.money_digits_after_decimal)) ? 2 : g.money_digits_after_decimal, f = g.decimal_separator || ".", c = g.thousands_separator || ",", h = a < 0 ? "-" : "", d = isNaN(a) ? NaN : parseInt(a = Math.abs(+a || 0).toFixed(e)) + 
                "", q = (q = d.length) > 3 ? q % 3 : 0;
                return isNaN(a) ? "" : (e = (q ? d.substr(0, q) + c : "") + d.substr(q).replace(/(\d{3})(?=\d)/g, "$1" + c) + (e ? f + Math.abs(a - d).toFixed(e).slice(2) : ""), g.currency_symbol_right ? e += b : e = b + e, h + e)
            }
        },contextFixed: {ctx: urlConfig.root,assets_ctx: urlConfig.assets,market_assets_ctx: dpz.market.directory,market_assets_local_ctx: dpz.market.directoryLocal,primary_market_assets_ctx: dpz.market.primaryDirectory}});
    h.loadConfig(a);
    h.setValidator($.validator);
    return h
});
define("dpz.dom", function() {
    var a = {}, b = {main: {}};
    return a = {group: function(a) {
            b[a] || (b[a] = {});
            return b[a]
        },registerDomReference: function(a, d) {
            $.extend(b[d || "main"], a)
        },getInputValue: function(a) {
            try {
                return a.val()
            } catch (b) {
                throw "Invalid jQuery form selection";
            }
        },setText: function(a) {
            try {
                a.elem.text(a.text)
            } catch (b) {
                throw "Invalid jQuery form selection";
            }
        }}
});
window.tnt = dpz.tnt = function(a, b, c) {
    var d = function() {
        this.promise = c.Deferred().always(function() {
            clearTimeout(this.timeout)
        }.bind(this));
        this.timeout = setTimeout(function() {
            this.promise.resolve()
        }.bind(this), tnt.ajaxTimeoutDuration)
    };
    d.prototype.resolve = function() {
        this.promise.resolve(this.data)
    };
    return {configObject: {testClass: "config",watchedActions: {}},mboxAllowableActions: {config: function(a) {
                var b = tnt.profileData.length, g = 0;
                tnt.getConfig = false;
                if (a.watchedActions) {
                    for (tnt.parseWatchedActions(a.watchedActions); g < 
                    b; g++)
                        tnt.actionIsWatched(tnt.profileData[g]) && !tnt.actionWasSent(tnt.profileData[g]) && (tnt.send({mboxName: tnt.watchedActions[tnt.profileData[g]].mboxName,mboxParams: {action: tnt.profileData[g],loggedin: site.func.customerLoggedIn() ? "loggedin" : site.func.customerSemiLoggedIn() ? "remembered" : "anonymous",storeid: jsDPZ.app.order.getOrder().data.Details.StoreID}}), tnt.profileData.splice(g, 1));
                    tnt.saveToSession()
                }
            },orderTimingSidebar: {newCb: function(b, e) {
                    function g(a) {
                        for (var g = site.catalogTools.getStoreTimeArr({date: a,
                            minTime: "00:00",maxTime: "23:59"}), a = [], e = 0, h = g.length; e < h; e++)
                            a.push({value: g[e].getDisplayFormat("HH:mm:00"),label: g[e].getDisplayFormat(dpz.market.marketConfig.dateFormat.TIME)});
                        g = c("#Future_Time", b);
                        c("option", g).not(":first").remove();
                        c("option:first", g).val("");
                        g.append(site.func.buildOptionList({listValues: a,defaultValue: ""}))
                    }
                    function h(a) {
                        if (e !== "g")
                            c(".future-order-controls", b)[a ? "removeClass" : "addClass"]("none")
                    }
                    site.data.ABData.orderTimingTestActive = true;
                    var d = jsDPZ.app.order.getOrder(), 
                    k = jsDPZ.app.store.getStore(), l = simplr.util.mEmpty(d.data.Details.OrderDateTime), m = l ? jsDPZ.obj.dateTime(k.data.StoreAsOfTime) : jsDPZ.obj.dateTime(d.data.Details.OrderDateTime), n = m.getDayOfWeek(), p = [], n = k.data.ServiceHours.Carryout[n];
                    if (d.data.Details.ServiceMethod != "Delivery" && parseInt(m.getDisplayFormat("HHmm"), 10) > parseInt(n[1] ? parseInt(n[1].CloseTime.replace(":", ""), 10) : parseInt(n[0].CloseTime.replace(":", ""), 10)))
                        p.push(m.getDisplayFormat("YYYY-MM-DD")), m = (new Date(m.data.getTime() + 864E5)).getDateTimeObject();
                    n = m.getDisplayFormat("YYYY-MM-DD");
                    g(n);
                    var o = dpz.config.getMarketProperty("dateFormat").DATE.replace(/\//g, "-"), n = moment(n, "YYYY-MM-DD").format(o);
                    c(".date_input", b).val(n);
                    l || c("#Future_Time", b).val(m.getDisplayFormat("HH:mm:00"));
                    c.extend(DateInput.DEFAULT_OPTS, {stringToDate: function(a) {
                            a = moment(a, o);
                            return a.isValid() ? a._d : null
                        },dateToString: function(a) {
                            return moment(a).format(o)
                        }});
                    c(".date_input", b).date_input({future_date_only: true,unorderable_dates: p}, function() {
                        var a = moment(c(this.input).val(), 
                        o).format("YYYY-MM-DD");
                        g(a)
                    });
                    c("a.js-viewRestrictions", b).click(function(a) {
                        a.preventDefault();
                        site.func.overlayToggle(true, "orderTimingRestrictions", {}, {})
                    });
                    c(".js-future-time, .js-future-date", b).on("change", function() {
                        c(".js-orderNow").prop("checked") && c(".js-orderLater").prop("checked", true);
                        c(this).closest("form").submit()
                    });
                    c(".js-orderTimingToggle", b).on("change", function() {
                        c("[name='Order_Timing']:checked", b).val() === "Now" ? (h(false), site.func.isOnCheckoutPage() && c(".js-future-time", b).val(""), 
                        simplr.controller.mRouteAndExecute(site.func.buildURL({url: "#/order/time/update"}))) : (h(true), site.trigger.onEvent({uri: a.location.hash.split("#")[1],group: "FutureOrder",subGroup: "DivShown",title: "FutureOrder-DivShown"}))
                    });
                    k.isOpenRightNow() ? (c(".js-storeClosed", b).remove(), c.inArray(d.data.Details.ServiceMethod, k.getAvailableServiceMethods({dtString: k.data.StoreAsOfTime,deliveryAvailable: jsDPZ.app.customer.getCustomer().data.Session.DeliveryAvailable})) != -1 ? c(".js-storeOpen", b).remove() : (c(".js-orderNow", 
                    b).closest("li").remove(), c(".js-orderLater", b).trigger("click"))) : (c(".js-orderNow", b).closest("li").remove(), c(".js-orderLater", b).trigger("click"), c(".js-storeOpen", b).remove());
                    e === "f" && (c("#orderDetailsInColumn h3 span:contains('My Location'), #myProfileInCheckout h3 span:contains('My Location')").text("Your Location"), c("#orderDetailsInColumn h3 span:contains('My Store'), #myProfileInCheckout h3 span:contains('My Store')").text("Your Store"), c("#orderDetailsInColumn h3:contains('Service Method'), #myProfileInCheckout h3:contains('Service Method')").text("Carryout or Delivery?"));
                    e === "g" && c(".future-order-controls").removeClass("none");
                    site.func.formFocus();
                    c("form", b).validate({rules: {Future_Date: {required: true},Future_Time: {required: true}},submitHandler: function(a) {
                            simplr.controller.mRouteAndExecute(site.func.buildURL({url: a.action,parameters: {date: moment(a.Future_Date.value, o).format("YYYY-MM-DD"),time: a.Future_Time.value}}))
                        },errorPlacement: function(a, g) {
                            a.appendTo(g.siblings(".js-error"))
                        }})
                }},cokeWaterfallTest: {isQualifyingOrder: function(a) {
                    var b = jsDPZ.app.catalog.getCatalog(), 
                    g = ["B8PCSBJ", "PINPASCA", "PINBBLCA", "CKRGSBQ"], c = this, d = [];
                    this.qualifyingNonPizzaVariantsInCart = [];
                    this.qualifyingPizzasInCart = [];
                    var k = a.filter(function(a) {
                        return b.getProduct(b.getVariant(a.Code).data.ProductCode).data.ProductType === "Drinks"
                    });
                    k.length || a.forEach(function(a) {
                        g.indexOf(a.Code) !== -1 && c.qualifyingNonPizzaVariantsInCart.push(a.Code);
                        (g.indexOf(a.Code) !== -1 || c.isQualifyingPizza(a) || c.isByoAlfredoPasta(a)) && d.push(a.Code)
                    });
                    return !k.length && d.length
                },isQualifyingPizza: function(a) {
                    if (jsDPZ.app.catalog.getCatalog().getVariant(a.Code).data.ProductCode === 
                    "S_PIZZA")
                        return a = Object.keys(a.Toppings).filter(function(a) {
                            return ["X", "Xm", "Bq", "Xw"].indexOf(a) === -1
                        }), a.length > 2 ? false : a.length === 2 ? a.indexOf("C") !== -1 && a.indexOf("P") !== -1 ? (this.qualifyingPizzasInCart.push("P"), true) : a.indexOf("C") !== -1 && a.indexOf("S") !== -1 ? (this.qualifyingPizzasInCart.push("S"), true) : false : a.indexOf("C") !== -1 ? (this.qualifyingPizzasInCart.push("C"), true) : a.indexOf("P") !== -1 ? (this.qualifyingPizzasInCart.push("P"), true) : a.indexOf("S") !== -1 ? (this.qualifyingPizzasInCart.push("S"), 
                        true) : false
                },isByoAlfredoPasta: function(a) {
                    if (a.Code === "PINPASBD" || a.Code === "PINBBLBD") {
                        var b = Object.keys(a.Toppings).filter(function(a) {
                            return this[a]["1/1"] !== void 0
                        }, a.Toppings);
                        if (b.length === 2 && b.indexOf("Du") !== -1 && b.indexOf("Xf") !== -1)
                            return this.qualifyingNonPizzaVariantsInCart.push(a.Code), true
                    } else
                        return false
                },upsellProductExists: function(a) {
                    return jsDPZ.app.catalog.getCatalog().getVariant(a).data !== void 0
                },qualifyingNonPizzaVariantsInCart: [],qualifyingPizzasInCart: []},inlinePanUpsell: {isQualifyingOrder: function(a) {
                    var b = 
                    jsDPZ.app.order.getOrder().data;
                    if (b.Details.Coupons.filter(function(a) {
                        return a.Code === "9194"
                    }).length || b.HideSizeUpsell)
                        return false;
                    b = b.Details.Coupons.filter(function(a) {
                        return a.Code === "9193"
                    });
                    a = a.filter(function(a) {
                        return a.Code === "12SCREEN" && a.Qty === 1 && (a.Options === void 0 || a.Options && Object.keys(a.Options).length <= 5) && (a.Options === void 0 || a.Options.C === void 0 || Number(a.Options.C["1/1"]) <= 1)
                    });
                    return b.length && a.length
                },isQualifyingProduct: function(a) {
                    return a.Code === "12SCREEN" && a.Qty === 1 && 
                    (a.Options === void 0 || a.Options && Object.keys(a.Options).length <= 5) && (a.Options === void 0 || a.Options.C === void 0 || Number(a.Options.C["1/1"]) <= 1)
                }},cheeseUpsellTest: function(a) {
                dpz.tnt.delayDoDefault(function(b) {
                    if (b && b.testClass === "cheeseUpsell")
                        jsDPZ.app.customer.getCustomer().data.Session.cheeseUpsell = b, site.sessionTools.save();
                    a.partialName = null;
                    if (jsDPZ.app.customer.getCustomer().data.Session.cheeseUpsell)
                        if (jsDPZ.app.customer.getCustomer().data.Session.cheeseUpsell.settings.experience === "b")
                            a.partialName = 
                            "abtestCheeseUpsellB";
                        else if (jsDPZ.app.customer.getCustomer().data.Session.cheeseUpsell.settings.experience === "c")
                            a.partialName = "abtestCheeseUpsellC";
                        else if (jsDPZ.app.customer.getCustomer().data.Session.cheeseUpsell.settings.experience === "d")
                            a.partialName = "abtestCheeseUpsellD";
                        else if (jsDPZ.app.customer.getCustomer().data.Session.cheeseUpsell.settings.experience === "e")
                            a.partialName = "abtestCheeseUpsellE";
                    site.func.overlayToggle(true, "builderPizza", {}, a)
                }, "Dominos-GeneralMenu")
            },crossSellTestCall: function(a) {
                var b = 
                jsDPZ.app.catalog.getCrossSellQuicklist().data, g = [];
                if (b && b.length) {
                    for (var h = 0, d = b.length; h < d; h++) {
                        var k = c.isArray(b[h]) ? b[h][0] : b[h];
                        k.Code !== "CKRGSJP" && k.Code !== "CKRGHTB" && k.Code !== "CKRGSBQ" && g.push(k)
                    }
                    b = a != "f" ? g.slice(0, 3) : g.slice(0, 4)
                }
                h = 0;
                for (d = b.length; h < d; h++)
                    k = b[h], k.Price = b[h].Type == "Coupon" ? jsDPZ.app.catalog.getCatalog().getCoupon(k.Code).data.Price : jsDPZ.app.catalog.getCatalog().getVariant(k.Code).data.Price;
                return b
            },ctaColorTestCall: function(a, b, g) {
                if (a && a.testClass === "ctaColorTest" && 
                !site.func.isHandheld() && (jsDPZ.app.customer.getCustomer().data.Session.ctaColorTest = a, site.sessionTools.save(), jsDPZ.app.customer.getCustomer().data.Session.ctaColorTest.settings.experience === "g"))
                    b.ctaColorTest = "btn--green-ab-test";
                a = simplr.layout.mAssembleLayout({component: "orderInColumn",tokens: b});
                g.resolve(a)
            },storeLocatorIconColors: function(a) {
                a = a.settings.experience;
                c("#locationsSearchPage .card--locations-search").removeClass("ABcontrol").addClass("locator-icons-container-abtest");
                c(".locator-icons-container-abtest").addClass("test-" + 
                a);
                c(".locator-icons-container-abtest .locator-icons-abtest-inner-container").css("visibility", "visible")
            },profileSignIn: function(f) {
                switch (a.location.hostname) {
                    case "www-dev.dominos.com":
                    case "www-qa.dominos.com":
                    case "www-qa2.dominos.com":
                    case "www-qa3.dominos.com":
                    case "www-qa4.dominos.com":
                    case "www-preprod.dominos.com":
                    case "www-prod1.dominos.com":
                    case "www-prod2.dominos.com":
                    case "www-prod3.dominos.com":
                    case "www-prod1.dominos.com":
                    case "www.dominos.com":
                        simplr.cookie.mSet({name: "homepageRedirect",
                            value: "true",domain: ".dominos.com"});
                        simplr.cookie.mSet({name: "AB_profileSignIn_homepageRedirect",value: "true",domain: ".dominos.com"});
                        a.location = urlConfig.localRoot + "/index.jsp";
                        break;
                    default:
                        (function() {
                            function a() {
                                var b = f.settings.experience;
                                site.data.ABData.profileSignIn = {experience: b,layoutComponent: null,savedClick: null,upsellStopover: false,mainNavOrderClick: false};
                                if (!site.func.customerLoggedIn())
                                    site.data.ABData.profileSignIn.layoutComponent = b;
                                require(["dpz.template"], function() {
                                    simplr.view.mRender({name: "headerProfileABTEST",
                                        data: {exp: b},selector: "#headerProfileContainer"})
                                });
                                (site.func.customerLoggedIn() || site.func.customerSemiLoggedIn()) && c(".site-nav--homepage").removeClass("experienceD");
                                if (f.settings.experience === "C" && !site.func.customerLoggedIn())
                                    site.data.customerLoginOverlay = "pizzaProfileLoginOverlayC"
                            }
                            if (site.data.ABData.minorNavigationRendered)
                                a();
                            else
                                c(b).on("minorNavigationRendered", function() {
                                    !site.func.customerLoggedIn() && !site.func.customerSemiLoggedIn() && a()
                                });
                            c(b).on("beforeLoginRedirect", function(a, 
                            e) {
                                e.evt && e.evt.target && simplr.cookie.mSet({name: "savedClick",value: e.evt.target.href,domain: "." + b.domain})
                            });
                            c(b).on("customerLogin.success", function() {
                                var a = simplr.cookie.mGet({name: "savedClick"});
                                if (a && a.length > 0)
                                    site.data.ABData.profileSignIn.savedClick.url = a, simplr.cookie.mSet({name: "savedClick",value: "",domain: "." + b.domain})
                            })
                        })()
                }
            },youSaved: function(a) {
                if (!jsDPZ.util.empty(a.settings) && a.settings.experience)
                    switch (site.data.ABData.youSaved = a.settings.experience, site.storage.save("youSavedABtest", 
                    a.settings.experience), a.settings.experience) {
                        case "greenOutline":
                            c(".js-youSaved").addClass("abTest-greenOutline");
                            break;
                        case "increasedFontSize":
                            c(".js-youSaved").addClass("abTest-fontSize");
                            break;
                        case "greenText":
                            c(".js-youSaved").addClass("abTest-greenText");
                            break;
                        case "alternateLocation":
                            c(".js-youSaved, .js-youSavedAlt, .finalizedTotal").addClass("abTest-altLocation")
                    }
            },storeLocatorCTAs: function(a) {
                if (!jsDPZ.util.empty(a.settings) && a.settings.experience !== "control") {
                    var b = a.settings.carryoutCTAtext, 
                    a = a.settings.deliveryCTAtext;
                    c(".js-orderDeliveryNow").html(a);
                    c(".js-orderCarryoutNow").html(b)
                }
                c(".location-search-result__details").fadeIn("fast")
            },productUpsellCTAs: function(a) {
                if (!jsDPZ.util.empty(a.settings) && a.settings.experience)
                    site.data.ABData.productUpsellCTAExperience = a.settings.experience
            },menuProductImages: function(a) {
                if (!jsDPZ.util.empty(a.settings) && a.settings.experience)
                    site.data.ABData.menuProductImages = a.settings.experience, site.storage.save("menuProductImagesABtest", a.settings.experience)
            },
            SpecialtyChickenUpsell: function(a) {
                a.settings.specialtyChicken && c.extend(site.data.ABData.specialtyChicken, a.settings.specialtyChicken);
                site.data.ABData.specialtyChicken.test == "control" && jsDPZ.app.catalog.setCrossSellItems(site.data.crossSellItemsQuickList("B2PCLAVA,B16PBIT,2LCOKE,B8PCSCB,PSANSAPH,W08PHOTW,MAGGFSAL,PINPASCA".split(",")))
            },locationSelectType: function(a) {
                if (a.settings.experience)
                    site.data.ABData.experience = a.settings.experience
            },HomePage: function() {
            },OrderCTA: function(b) {
                var e = a.location.href.toString().match(/lang=([a-z]{2})/), 
                e = e ? e[1] : c("html").attr("lang");
                c("body").addClass("js-TTOrderOnline");
                c(".js-mBoxOOSwap").html(b[e]);
                c(".imgLink").removeClass("imgLink giftCardLink").html("Gift Cards")
            },UpsellWaterfall: function(a) {
                jsDPZ.app.catalog.setCrossSellItems && site.data.crossSellItemsQuickList && jsDPZ.app.catalog.setCrossSellItems(site.data.crossSellItemsQuickList(a))
            },PizzaBuilder: function(a) {
                site.func.setPizzaBuilder(a.settings)
            },OrderCheckout: function(a) {
                site.func.setOrderCheckout(a.settings)
            },EntreesHome: function(a) {
                a.settings.priceMyOrder && 
                c.extend(site.data.ABData.priceMyOrder, a.settings.priceMyOrder)
            },ChickenBuilder: function(a) {
                if (a.settings.hideDippingCups)
                    site.data.ABData.hideDippingCups = true, c("#js-sides").hide()
            },hideVoiceOrderFooter: function() {
                delete dpz.config.home[0].anonymous.MonToThu[3];
                delete dpz.config.home[0].anonymous.FriToSun[3];
                delete dpz.config.home[0].loggedin.MonToThu[4];
                delete dpz.config.home[0].loggedin.FriToSun[4]
            },SignIn: function() {
            },rwdSignInButton: function(a) {
                if (a && a.settings) {
                    var b = c(".nav__login");
                    switch (a.settings.experience) {
                        case "b":
                            c("header[role='banner']").append(b);
                            c("a", b).addClass("btn");
                            break;
                        case "c":
                        case "d":
                            a.settings.experience === "d" && c(".js-login", b).text("Profile Sign In");
                            b.insertAfter(c(".nav--buttons li:eq(0)")).wrap("<li class='grid__cell--one-half'></li>");
                            c("a", b).addClass("btn btn--block");
                            c(".nav--buttons li:last-child").remove();
                            break;
                        case "e":
                            b.insertAfter(c(".nav--buttons li:eq(0)")).wrap("<li class='grid__cell--one-half'></li>"), c("a", b).addClass("btn btn--block"), c(".js-tracker-link").insertAfter(c(".nav--buttons li:eq(2)")).wrap("<li class='grid__cell--one-third'></li>"), 
                            c(".nav--buttons li:last-child").remove(), b = c(".nav--buttons li:gt(1)"), c("a", b).removeClass("btn").addClass("btn--plain-text"), b.removeClass("grid__cell--one-half").addClass("grid__cell--one-quarter nav__very-minor"), b.filter(":eq(0)").addClass("grid__cell--offset-one-eighth")
                    }
                    c("html").addClass("AB-rwd-sign-in--exp-" + a.settings.experience)
                }
                c(".AB-rwd-sign-in--none").removeClass("AB-rwd-sign-in--none")
            },mixMatch16: function(a) {
                var b = a.settings.experience;
                site.data.ABData.mixMatch16test = true;
                switch (b) {
                    case "B":
                    case "C":
                    case "E":
                    case "H":
                    case "I":
                    case "L":
                    case "N":
                    case "O":
                        c("#mix-match-599-hero").find(".media__btn").addClass("small")
                }
                site.func.unhideDelayedABTiles();
                c("#homePage").on("click", ".js-599mixmatch-hero a", function(a) {
                    a.preventDefault();
                    var f = "", f = a.pageY, d = c(".mixmatch-hero").offset().top;
                    c(a.target).hasClass("btn") ? (f = "CTA Button Click", dpz.tnt.send({mboxName: "MixMatch16ButtonClick",mboxParams: {}})) : d <= f && f < d + 173 ? (f = "Top Third", dpz.tnt.send({mboxName: "MixMatch16TopThird",mboxParams: {}})) : d + 173 < f && f <= d + 346 ? (f = "Middle Third", dpz.tnt.send({mboxName: "MixMatch16MiddleThird",mboxParams: {}})) : (f = "Bottom Third", dpz.tnt.send({mboxName: "MixMatch16BottomThird",
                        mboxParams: {}}));
                    a = c(this).data("wt-panelnumber");
                    d = c(this).data("wt-panelname");
                    site.trigger.onEvent({uri: "/home/HERO",title: "Main Promo Box",group: "Home Page Promo 1",subGroup: "Mix/Match $5.99 (9193 or 9194) - Experience " + b + " - " + f});
                    site.func.overlayToggle(true, "panUpsellOverlay", {}, {recoverable: true,panelNumber: a,panelName: d,defaultCoupon: "9193",upsellCoupon: "9194",couponPrice: "2.00"})
                })
            },panUpsell2v3: function(a) {
                var b = {recoverable: true,panelNumber: 1,panelName: "599mixmatch",defaultCoupon: "9193"};
                switch (a.settings.experience) {
                    case "b":
                        c.extend(b, {upsellCoupon: "9194",couponPrice: "2.00",title: "Special Offer!",message: "Would you like to make one item a Handmade Pan Pizza for $2.00 more?",imageCode: "AB-2M2T-PAN-upsell"});
                        break;
                    case "c":
                        c.extend(b, {upsellCoupon: "9205",couponPrice: "3.00",title: "Special Offer!",message: "Would you like to make one item a Handmade Pan Pizza for $3.00 more?",imageCode: "2M2T-PAN-upsell"});
                        break;
                    case "d":
                        c.extend(b, {upsellCoupon: "9205",couponPrice: "3.00",title: "Mix and Match Offer &#8212; Now with Specialty Chicken",
                            message: "Great Choice! Would you like to make one of your Mix and Match items a Handmade Pan Pizza for just $3.00 more?",imageCode: "AB-2M2T-PAN-upsell"});
                        break;
                    default:
                        c.extend(b, {upsellCoupon: "9194",couponPrice: "2.00",title: "Mix and Match Offer &#8212; Now with Specialty Chicken",message: "Great Choice! Would you like to make one of your Mix and Match items a Handmade Pan Pizza for just $3.00 more?",imageCode: "2M2T-PAN-upsell"})
                }
                site.func.overlayToggle(true, "AB_panUpsell2v3_panUpsellOverlay", {}, b)
            },
            couponsVsDealsVsOffers: function(a) {
                c(".site-nav__main > li > a:contains('Coupons'), .header--homepage .btn:contains('Coupons')").text(a.settings.buttonLabel);
                c(".site-nav__main").css("visibility", "visible")
            },cokeParmUpsell: function(a) {
                site.func.toggleLoading(true);
                if (a.settings.experience !== "control") {
                    site.data.ABData.cokeAndParmBreadBitesUpsell = true;
                    var b = {testClass: a.settings.experience ? a.settings.experience : "control"};
                    setTimeout(function() {
                        site.func.toggleLoading(false);
                        if (jsDPZ.app.order.getOrder().data.HasSeenUpsell)
                            simplr.controller.mRouteAndExecute("/order/price/?checkout=1");
                        else {
                            var a = true;
                            if (jsDPZ.app.order.getOrder().data.Details.Variants.length > 0)
                                for (var c = jsDPZ.app.order.getOrder().data.Details.Variants, f = 0, d = c.length; f < d; f++) {
                                    var l = jsDPZ.app.catalog.getCatalog(), m = l.getVariant(c[f].Code).data.ProductCode;
                                    if (l.getProduct(m).data.ProductType == "Drinks" || m == "F_PBITES") {
                                        a = false;
                                        break
                                    }
                                }
                            a ? (jsDPZ.app.order.getOrder().data.HasSeenUpsell = true, site.func.overlayToggle(true, "cokeVersusParmUpsellProductOverlayABTestView", {keepCentered: true}, b)) : simplr.controller.mRouteAndExecute("/order/upsell/")
                        }
                    }, 
                    1E3)
                } else
                    simplr.controller.mRouteAndExecute("/order/upsell/")
            },doubleProductUpsell: function(a) {
                var b = jsDPZ.app.catalog.getCrossSellQuicklist().data.slice(0, 1), g = function() {
                    site.func.overlayToggle(true, "upsellProductOverlay", {keepCentered: true}, b[0])
                };
                a.settings.experience !== "control" && (jsDPZ.app.catalog.setCrossSellItems(site.data.crossSellItemsQuickList("B2PCLAVA,CINNASTIX8,B32PBIT,B8PCSCB,2LCOKE,2LDCOKE,W08PHOTW,W08PBNLW,PSANSAPH,PSANSACB,PINPASCA,PINPASCC".split(","))), jsDPZ.app.catalog.setCatalog(jsDPZ.app.catalog.getCatalog().data), 
                b = jsDPZ.app.catalog.getCrossSellQuicklist().data.slice(0, 2));
                if (b.length) {
                    if (a.settings.experience !== "control")
                        var c = {experience: a.settings.experience,upsellData: b}, g = function() {
                            site.func.overlayToggle(true, "doubleUpsellProductOverlay", {keepCentered: true}, c)
                        };
                    b[0].Type === "Coupon" ? site.func.overlayToggle(true, "upsellCouponOverlay", {keepCentered: true}, b[0]) : !jsDPZ.util.empty(b[0].UpsellData.overlayType) && b[0].UpsellData.overlayType == "flavorPicker" ? site.func.overlayToggle(true, "upsellProductOverlayFlavor", 
                    {keepCentered: true}, b[0]) : g()
                } else
                    simplr.controller.mRouteAndExecute("/order/price/?checkout=1")
            }},runHomePage: function() {
            tnt.homePageABOn && tnt.send({mboxName: "Dominos-HomePage",mboxParams: {action: "Domino\\'s Home Page",sync: false,clickedLoginRedirect: simplr.cookie.mGet({name: "homepageRedirect"}) ? true : false}})
        },beforeSendMethods: {addProductArray: function(a) {
                for (var b = {}, g = [], h = jsDPZ.app.catalog.getCatalog(), d = jsDPZ.app.order.getOrder().data.Details.Variants, k = d.length - 1; k >= 0; k--) {
                    var l = h.getProduct(h.getVariant(d[k].Code).data.ProductCode).data.ProductType;
                    b[l] = l
                }
                for (k in b)
                    g.push(b[k]);
                return c.extend({}, a, {productdata: g.join(";")})
            },addChickenArray: function(a) {
                for (var b = jsDPZ.app.order.getOrder().data.Details.Variants, g = [], h = 0, d = b.length; h < d; h++) {
                    var k = jsDPZ.app.catalog.getCatalog().getVariant(b[h].Code).data.ProductCode;
                    jsDPZ.app.catalog.getCatalog().getProduct(k).data.ProductType == "Wings" && g.push(k)
                }
                return c.extend({}, a, {chickendata: g.join(";")})
            }},watchedActions: {},promisedMboxes: {},testGroups: [],homePageABOn: false,sentActions: [],actionsForceTest: {},
        profileData: [],mboxes: {},cache: {},ajaxTimeout: {},SRTimeout: {},hpIntentEvents: ["Header Order", "Header Order Online", "Right Lower Promo Box", "Right Upper Promo Box", "Main Promo Box"],homepageIntent: void 0,homepageIntentSent: false,ajaxTimeoutDuration: 1E3,getConfig: true,delayDoDefault: function(a, b) {
            tnt.send({mboxName: b,mboxParams: {}});
            tnt.getPromisedMbox(b).promise.done(a)
        },delayShowContent: function() {
            clearTimeout(tnt.ajaxTimeout);
            tnt.ajaxTimeout = setTimeout(function() {
                tnt.showContentNow()
            }, tnt.ajaxTimeoutDuration)
        },
        showContentNow: function(a) {
            clearTimeout(tnt.ajaxTimeout[a]);
            (a || tnt.ajaxTimeout[a]) && clearTimeout(tnt.ajaxTimeout[a]);
            c(".abshow").show().attrShow().removeClass("abshow")
        },parseWatchedActions: function(a) {
            for (var b in a)
                a.hasOwnProperty(b) && (tnt.watchedActions[b] = {mboxName: a[b].mbox || "Dominos-Global",abtest: a[b].abtest || false,cache: a[b].cache || false,limit: a[b].limit || false,persist: a[b].persist || false,sync: a[b].sync || false,beforeSend: a[b].beforeSend || false})
        },actionIsWatched: function(a) {
            return tnt.watchedActions.hasOwnProperty(a) && 
            !tnt.watchedActions[a].persist
        },actionWasSent: function(a) {
            return c.inArray(a, tnt.sentActions) != -1
        },actionIsPersisted: function(a) {
            return tnt.watchedActions.hasOwnProperty(a) && tnt.watchedActions[a].persist ? tnt.watchedActions[a].persist : false
        },actionIsSynchronous: function(a) {
            return tnt.watchedActions.hasOwnProperty(a) && tnt.watchedActions[a].hasOwnProperty("sync") ? tnt.watchedActions[a].sync : false
        },actionTriggersABTest: function(a) {
            return tnt.watchedActions.hasOwnProperty(a) && tnt.watchedActions[a].hasOwnProperty("abtest") ? 
            tnt.watchedActions[a].abtest : false
        },getBeforeSend: function(a) {
            return tnt.watchedActions.hasOwnProperty(a) && tnt.watchedActions[a].beforeSend && tnt.beforeSendMethods.hasOwnProperty(tnt.watchedActions[a].beforeSend) ? tnt.beforeSendMethods[tnt.watchedActions[a].beforeSend] : false
        },isCachedAction: function(a) {
            return tnt.watchedActions.hasOwnProperty(a) && tnt.watchedActions[a].cache ? tnt.watchedActions[a].cache : false
        },isLimitedAction: function(a) {
            return tnt.watchedActions.hasOwnProperty(a) && tnt.watchedActions[a].limit ? 
            tnt.watchedActions[a].limit : false
        },shouldUseCache: function(a) {
            return tnt.isCachedAction(a) && tnt.actionWasSent(a)
        },shouldLimitCall: function(a) {
            return tnt.isLimitedAction(a) && tnt.actionWasSent(a)
        },cacheActionResponse: function(a) {
            var b = "";
            a.passed && (b = tnt.createCacheKey(a.passed), tnt.cache[b] && (tnt.cache[b] = a, tnt.saveToSession()))
        },createCacheKey: function(a) {
            var b = [], g;
            for (g in a)
                b.push([g, a[g]]);
            b.sort(function(a, b) {
                return a[0] < b[0] ? -1 : 1
            });
            return jsDPZ.dataConversion.JSONObjectToString(b)
        },isWWWServer: function() {
            return a.location.host.indexOf("www") == 
            0
        },saveToWindow: function(b) {
            var e;
            a.name != "" && (e = jsDPZ.dataConversion.JSONStringToObject(a.name), typeof e != "undefined" && (b = c.extend({}, e, b)));
            a.name = jsDPZ.dataConversion.JSONObjectToString(b)
        },loadFromWindow: function() {
            var b;
            if (a.name != "")
                b = jsDPZ.dataConversion.JSONStringToObject(a.name), typeof b != "undefined" && b.tnt && (tnt = c.extend({}, tnt, b.tnt)), a.name = ""
        },saveToSession: function() {
            tnt.isWWWServer() ? tnt.saveToWindow({tnt: {cache: tnt.cache,homepageIntent: tnt.homepageIntent,homepageIntentSent: tnt.homepageIntentSent,
                    actionsForceTest: tnt.actionsForceTest,sentActions: tnt.sentActions,watchedActions: tnt.watchedActions,getConfig: tnt.getConfig,profileData: tnt.profileData,testGroups: tnt.testGroups}}) : (jsDPZ.app.customer.getCustomer().data.Session = c.extend({}, jsDPZ.app.customer.getCustomer().data.Session, {tnt: {cache: tnt.cache,homepageIntent: tnt.homepageIntent,homepageIntentSent: tnt.homepageIntentSent,actionsForceTest: tnt.actionsForceTest,sentActions: tnt.sentActions,watchedActions: tnt.watchedActions,getConfig: tnt.getConfig,
                    profileData: tnt.profileData,testGroups: tnt.testGroups}}), site.sessionTools.save({async: false}))
        },loadSession: function() {
            site.sessionTools.load();
            var a = jsDPZ.app.customer.getCustomer().data.Session;
            a.tnt && (tnt = c.extend({}, tnt, a.tnt));
            tnt.loadFromWindow()
        },saveCall: function(a) {
            if (typeof a == "object") {
                var b = "";
                if (a.action && (tnt.sentActions.push(a.action), a.abtest))
                    tnt.actionsForceTest[a.action] = a.abtest;
                b = tnt.createCacheKey(a);
                tnt.cache[b] || (tnt.cache[b] = {});
                tnt.saveToSession()
            }
        },fake: function(a) {
            var b = 
            "";
            if (tnt.actionsForceTest[a.action])
                a.abtest = tnt.actionsForceTest[a.action];
            b = tnt.createCacheKey(a);
            if (tnt.cache[b] && (a = tnt.cache[b], tnt.mboxAllowableActions[a.testClass]))
                tnt.mboxAllowableActions[a.testClass](a)
        },includeDefaultData: function(a) {
            return c.extend({}, a, {abtest: simplr.util.mGetUrlParameter("abtest"),environment: location.hostname.split(".dominos")[0],loggedin: site.func.customerLoggedIn() ? "loggedin" : site.func.customerSemiLoggedIn() ? "remembered" : "anonymous",returnuser: jsDPZ.app.customer.getCustomer().data.Session.ReturnUser,
                storeid: jsDPZ.app.order.getOrder().data.Details.StoreID,hascoupon: jsDPZ.app.order.getOrder().data.Details.Coupons.length ? true : false,isGroupOrder: site.func.isGroupOrdering(),serviceMethod: jsDPZ.app.order.getOrder().data.Details.ServiceMethod,activeMarket: dpz.market.activeLanguageCode + "_" + dpz.market.marketCode})
        },includeCustomData: function(a) {
            var b = tnt.getBeforeSend(a.action);
            return b ? b(a) : a
        },send: function(b) {
            if (!killConfig.isMarketEnabled("mBox") || !("mboxDefine" in a))
                tnt.resolveMbox(b.mboxName);
            else if (tnt.mboxes[b.mboxName] == 
            null && Modernizr && Modernizr.localstorage)
                if (b.mboxParams && b.mboxParams.action && (tnt.shouldUseCache(b.mboxParams.action) || tnt.shouldLimitCall(b.mboxParams.action)))
                    tnt.shouldUseCache(b.mboxParams.action) && tnt.fake(b.mboxParams);
                else {
                    var b = b || {}, e = b.mboxName || "Dominos-Global", g = typeof b.mboxParams === "object" ? c.extend(true, {}, b.mboxParams) : {}, g = tnt.includeDefaultData(g), g = tnt.includeCustomData(g);
                    tnt.isCachedAction(g.action) ? tnt.saveCall(g) : tnt.isLimitedAction(g.action) && (tnt.sentActions.push(g.action), 
                    tnt.saveToSession());
                    g.profiledata = tnt.profileData.join(";");
                    g = c.map(g, function(a, b) {
                        return [b + "=" + a]
                    });
                    g.unshift(e);
                    b.mboxParams.hasOwnProperty("sync") && b.mboxParams.sync || tnt.actionIsSynchronous(b.mboxParams.action) ? (tnt.mboxes[e] || (tnt.mboxes[e] = c("<div>").attr("id", e).addClass("mboxDefault"), c("body").prepend(tnt.mboxes[e])), tnt.actionTriggersABTest(b.mboxParams.action) && tnt.delayShowContent(), mboxCreate.apply(null, g)) : (tnt.mboxes[e] || (tnt.mboxes[e] = c("<div>").attr("id", e).addClass("mboxDefault"), 
                    c("body").prepend(tnt.mboxes[e]), mboxDefine(e, e)), tnt.actionTriggersABTest(b.mboxParams.action) && tnt.delayShowContent(), mboxUpdate.apply(null, g))
                }
        },parse: function(b) {
            var e = "mboxCurrent" in a && mboxCurrent.getName();
            if (e)
                tnt.getPromisedMbox(e).data = b;
            Modernizr.localstorage && b.testClass && (b.testGroup && c.inArray(b.testGroup, tnt.testGroups) === -1 && (tnt.testGroups.push(b.testGroup), tnt.saveToSession(), site.trigger.onEvent({uri: "/abtest/decision/",title: "AB Test Decision",group: "AB Test",subGroup: "AB Test Decision"})), 
            tnt.mboxAllowableActions[b.testClass] && (tnt.cacheActionResponse(b), tnt.mboxAllowableActions[b.testClass](b)))
        },resolveMbox: function(a) {
            tnt.getPromisedMbox(a).resolve()
        },getPromisedMbox: function(a) {
            return tnt.promisedMboxes[a] = tnt.promisedMboxes[a] || new d
        }}
}(window, document, $);
dpz.stjude = function(a, b, c) {
    c(b).on("confirmationPage.load", function() {
        dpz.stjude.updateTrackerTileEligibility()
    });
    c(b).on("trackerLookup.load", function(a, b) {
        dpz.stjude.updateTrackerLookupPageTileEligibility(b)
    });
    return {config: {openFieldABExperience: "",trackerTiles: {thankYou: false,notTooLate: true},productCodes: ["STJUDE", "STJUDE1", "STJUDE2", "STJUDE5", "STJUDE10"],couponCodes: ["9186"]},donationInCart: function() {
            for (var a = jsDPZ.app.order.getOrder().data.Details.Variants, b = 0, e = a.length; b < e; b++)
                if (a[b].Code.indexOf("STJUDE") > 
                -1)
                    return true;
            return false
        },couponInCart: function(a) {
            for (var b = jsDPZ.app.order.getOrder().data.Details.Coupons, e = 0, g = b.length; e < g; e++)
                if (b[e].Code === a)
                    return true;
            return false
        },roundUpTotal: function() {
            var a = jsDPZ.app.order.getOrder().data.Details.Amounts.Customer, b = 0;
            if (a)
                a = jsDPZ.obj.price(a).data, b = (Math.ceil(a) - a).toFixed(2);
            return b
        },roundUpDonationEligible: function(a) {
            a = a || this.roundUpTotal();
            return a > 0 ? true : false
        },updateTrackerTileEligibility: function() {
            for (var a = site.data.lastOrder.Details.Promotions.Experiences || 
            [], b = 0, e = a.length; b < e; b++)
                if (a[b].Code === "ContainsStJudeDonation")
                    this.config.trackerTiles.thankYou = true, this.config.trackerTiles.notTooLate = false
        },updateTrackerLookupPageTileEligibility: function(a) {
            if (a.Order.OrderDescription.indexOf("St. Jude") > -1)
                this.config.trackerTiles.thankYou = true, this.config.trackerTiles.notTooLate = false
        }}
}(window, document, $);
dpz.loyalty = function(a, b, c) {
    var d = {signinURL: "#/checkout/info/",activateURL: "#/rewards/activate/",dashboardURL: "#/customer/rewards/",warningWindowBase: 30,history: {pageIndex: 1,pageSize: 2E3,separatePending: true,hideLoading: true,translations: {ADJUSTMENT: "customer.loyalty_activity_adjustment",BONUS: "customer.loyalty_activity_bonus",EXPIRATION: "customer.loyalty_activity_expired",NON_QUALIFYING_ORDER: "customer.loyalty_activity_non_qualifying",QUALIFYING_ORDER: "customer.loyalty_activity_qualifying",REDEMPTION: "customer.loyalty_activity_redemption",
                POINTS_RETURNED: "customer.loyalty_activity_returned"}},loyaltyIsOk: true,enrollmentBonusConfig: {show: true,bonusPoints: 10,bonusTotalNeeds: 10},defaultBase: {pointsPerOrder: 10,totalNeeded: 10,rewardPoints: 60,rewardString: "customer.loyalty_reward_2m2t"},commands: {enroll: "LOYALTY_ENROLL",optOut: "LOYALTY_OPT_OUT",redeem: "LOYALTY_REDEEM"},animateBar: true}, f = function() {
        var a = jsDPZ.app.customer.getCustomer().data;
        return a.Loyalty && (a.Loyalty.AccountStatus === "ACTIVE" || a.Loyalty.AccountStatus === "SUSPENDED")
    };
    return {canEnroll: function() {
            return this.loyaltyIsActive() && 
            this.loyaltyIsOk() && !this.isEnrolled() && this.store.isParticipating()
        },canRedeem: function(a) {
            var a = a ? a : this.getBaseCoupon().CouponCode, b = jsDPZ.app.store.getStore().data.StoreID, b = this.store.isParticipating() || b === "", c = jsDPZ.app.customer.getCustomer().data.Loyalty.AccountStatus;
            if (this.isEnrolled() && c != "SUSPENDED" && a !== "" && b) {
                for (var d = this.getPizzaCount(), f = jsDPZ.app.order.getOrder().data.Details.Coupons, b = 0, c = f.length; b < c; b++) {
                    var l = f[b];
                    if (l.Code === a)
                        if ((f = jsDPZ.app.catalog.getCatalog().getCoupon(a)) && 
                        f.data)
                            return f.isActive().Success && d > 0 && l.Qty < parseInt(f.data.Tags.LimitPerOrder);
                        else {
                            d = jsDPZ.app.customer.getCustomer().data.Loyalty.LoyaltyCoupons;
                            b = 0;
                            for (c = d.length; b < c; b++)
                                if (f = d[b], f.CouponCode === a)
                                    return f.LimitPerOrder ? l.Qty < f.LimitPerOrder : l.Qty === 1;
                            return false
                        }
                }
                return d > 0
            }
            return false
        },config: d,enrollCustomer: function() {
            var a = jsDPZ.app.customer.getCustomer().data;
            c.extend(true, a.Loyalty, {Command: "ENROLL"});
            site.func.saveAccountData({data: a,success: function(b) {
                    b.Loyalty && b.Loyalty.Status !== 
                    "Fail" ? jsDPZ.ajax.fetchLoyaltySummary(a.CustomerID).then(function(b) {
                        c.extend(true, a.Loyalty, b);
                        delete a.Loyalty.CustomerID;
                        jsDPZ.app.customer.getCustomer().data.Session.loyaltyConfirmation = true;
                        site.sessionTools.save();
                        dpz.loyalty.loyaltyRedirect()
                    }, function(a) {
                        if (a.status !== 404)
                            jsDPZ.app.customer.getCustomer().data.Session.loyaltyIsOk = false;
                        jsDPZ.app.customer.getCustomer().data.Session.loyaltyConfirmation = true;
                        dpz.loyalty.loyaltyRedirect()
                    }) : (b.Loyalty || dpz.loyalty.updateLoyaltyStatus(false), site.func.overlayToggle(true, 
                    "codeOverlay", {}, {code: "eLoyaltyEnrollmentFailed"}))
                }})
        },isReroute: function() {
            return jsDPZ.app.customer.getCustomer().data.Session.LoyaltyRedirect && jsDPZ.app.customer.getCustomer().data.Session.LoyaltyRedirect != ""
        },loyaltyRedirect: function(b) {
            if (b)
                jsDPZ.app.customer.getCustomer().data.Session.LoyaltyRedirect = b, site.sessionTools.save();
            var b = jsDPZ.app.customer.getCustomer().data.Session.LoyaltyRedirect, g = site.func.customerLoggedIn(), c = site.func.customerSemiLoggedIn(), f = dpz.loyalty.isEnrolled();
            if ((g || 
            c) && this.store.isParticipating() && !f && !site.isPaymentPage)
                b = d.activateURL;
            else if (!g && !c)
                b = d.signinURL;
            else if ((g || c) && f)
                b = jsDPZ.app.customer.getCustomer().data.Session.LoyaltyRedirect, jsDPZ.app.customer.getCustomer().data.Session.LoyaltyRedirect = "", site.sessionTools.save();
            b[0] === "#" ? a.location.hash = b : a.location = b
        },doStopOver: function() {
            return this.loyaltyIsOk() && site.func.customerLoggedIn() && !f() && this.store.isParticipating() || !site.func.customerLoggedIn() && this.store.isParticipating()
        },loyaltyIsActive: function() {
            return killConfig.isMarketEnabled("loyalty")
        },
        loyaltyIsOk: function() {
            var a = jsDPZ.app.customer.getCustomer().data;
            return this.config.loyaltyIsOk && a.Session.loyaltyIsOk !== void 0 ? a.Session.loyaltyIsOk : this.config.loyaltyIsOk
        },isEnrolled: f,getBasePoints: function(a) {
            var a = a ? a : this.getBaseCoupon().CouponCode, b = jsDPZ.app.customer.getCustomer().data.Loyalty.LoyaltyCoupons;
            if (this.isEnrolled())
                for (var c = 0, d = b.length; c < d; c++) {
                    var f = b[c];
                    if (f.CouponCode === a)
                        return f.PointValue
                }
            return 0
        },getCustomerPoints: function() {
            jsDPZ.app.customer.getCustomer();
            var a = 
            {BalancePoints: 0,PendingPoints: 0,RemainderPoints: 0,HasEarnedNewPizza: false};
            a.Potential = jsDPZ.app.order.getOrder().data.Details.Loyalty.Potential;
            a.BalancePoints = jsDPZ.app.customer.getCustomer().data.Loyalty.VestedPointBalance - a.Potential.Burn.RedemptionPoints;
            a.PendingPoints = jsDPZ.app.customer.getCustomer().data.Loyalty.PendingPointBalance;
            a.RemainderPoints = (jsDPZ.app.customer.getCustomer().data.Loyalty.VestedPointBalance - a.Potential.Burn.RedemptionPoints) % this.getBasePoints();
            a.HasEarnedNewPizza = 
            a.RemainderPoints == 0 && a.BalancePoints > 0;
            return a
        },getEnrollmentBonusConfig: function() {
            return c.extend({show: false,bonusPoints: 0,bonusTotalNeeds: 0}, this.config.enrollmentBonusConfig)
        },getPizzaCount: function(a) {
            a = a ? a.BalancePoints : this.getCustomerPoints().BalancePoints;
            a < 0 && (a = 0);
            return Math.floor(a / this.getBasePoints())
        },store: {storeSelectionChanged: false,isParticipating: function() {
                return jsDPZ.app.store.getStore().data.Pop
            },showStoreParticipationMessage: function() {
                dpz.loyalty.loyaltyIsActive() && dpz.loyalty.loyaltyIsOk() && 
                dpz.loyalty.store.isParticipating() && !dpz.loyalty.isEnrolled() && dpz.loyalty.store.storeSelectionChanged && site.func.overlayToggle(true, "loyaltyStoreParticipationOverlay", {}, {})
            },willDisplayParticipationMessage: function() {
                return dpz.loyalty.loyaltyIsActive() && dpz.loyalty.loyaltyIsOk() && dpz.loyalty.store.isParticipating() && !dpz.loyalty.isEnrolled() && dpz.loyalty.store.storeSelectionChanged
            }},updateWidgets: function(a) {
            var b = c.extend({keepCoupons: false}, a);
            if (this.isEnrolled()) {
                if ((a = this.config.animateBar) && 
                !simplr.util.mEmpty(jsDPZ.app.customer.getCustomer().data.Session.AnimateWidgets))
                    a = jsDPZ.app.customer.getCustomer().data.Session.AnimateWidgets;
                simplr.view.mRender({name: "loyalty_widget_balance",data: {animate: a},selector: ".loyalty--widget-container--balance"});
                simplr.view.mRender({name: "loyalty_widget_redemption",data: {keepCoupons: b.keepCoupons},selector: ".loyalty--widget-container--redemption"});
                simplr.view.mRender({name: "loyalty_widget_alerts",data: {},selector: ".loyalty--widget-container--alerts"});
                if (b.showInfo) {
                    var h = b.showInfo.pageName ? b.showInfo.pageName : utag.data.page_title;
                    c(".loyalty-icon-info").off("click.loyaltyWidget").on("click.loyaltyWidget", function() {
                        var a = c.extend(true, {title: "LoyaltyWidget " + h,group: "Loyalty Widget",subGroup: h + " Show Info",uri: "LoyaltyWidget/" + h + "/ShowInfo"}, b.showInfo.webTrendEvent);
                        site.trigger.onEvent(a);
                        c.isFunction(b.showInfo.callback) && b.showInfo.callback()
                    })
                }
                this.config.animateBar = false;
                jsDPZ.app.customer.getCustomer().data.Session.AnimateWidgets = false;
                site.sessionTools.save()
            }
        },getPointsRange: function() {
            var a = {FloorPoints: 0,CeilingPoints: 0,BasePoints: this.getBasePoints()}, b = this.getPizzaCount(this.getCustomerPoints());
            a.FloorPoints = b * this.getBasePoints();
            a.CeilingPoints = (b + 1) * this.getBasePoints();
            return a
        },getPercentage: function() {
            var a = this.getCustomerPoints(), b = a.BalancePoints, c = this.getPizzaCount(this.getCustomerPoints());
            return (a.HasEarnedNewPizza ? 1 : (b - c * this.getBasePoints()) / this.getBasePoints()) * 100 + "%"
        },isLastActivityInsideWarningTime: function() {
            if (this.isEnrolled()) {
                var a = 
                a = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD"), b = moment(jsDPZ.app.customer.getCustomer().data.Loyalty.BasePointExpirationDate, "YYYY-MM-DD");
                if (b.isValid()) {
                    var c = moment(a).add(this.config.warningWindowBase, "days");
                    return c.isSame(b) || c.isAfter(b) && (b.isAfter(a) || b.isSame(a))
                }
            }
            return false
        },getHistoryPoints: function(a) {
            if (this.loyaltyIsActive() && this.loyaltyIsOk() && this.isEnrolled()) {
                var b = a && a.separatePending ? a.separatePending : this.config.history.separatePending, h = a && a.successCallback ? a.successCallback : 
                function() {
                }, d = a && a.errorCallback ? a.errorCallback : function() {
                };
                jsDPZ.ajax.fetchLoyaltyHistory({pageIndex: a && a.pageIndex ? a.pageIndex : this.config.history.pageIndex,pageSize: this.config.history.pageSize,useCache: false,success: function(a) {
                        if (a.Status !== "Fail") {
                            for (var e = 0, f = a.History.length; e < f; e++)
                                a.History[e].TransactionDate = moment(a.History[e].TransactionDate).format("MM/DD/YY");
                            f = {completedHistory: [],pendingHistory: [],fullHistory: a.History};
                            if (b) {
                                for (var n = [], p = [], e = 0; e < a.History.length; e++) {
                                    var o = 
                                    c.extend({Description: "",OrderNumber: "",Points: "",PointBalance: "",PointStatus: "",TransactionDate: "",TransactionType: "",TransactionTotal: null,translateText: "",displayCustomerService: false,showBalance: true}, a.History[e], {Points: a.History[e].Points ? a.History[e].Points : 0,PointBalance: a.History[e].PointBalance ? a.History[e].PointBalance : 0});
                                    o.activityClass = "loyalty-history--cell--" + o.TransactionType.toLowerCase().replace(RegExp(" ", "g"), "-").replace(RegExp("_", "g"), "-");
                                    o.pointStatusClass = "loyalty-history--cell--" + 
                                    o.PointStatus.toLowerCase();
                                    o.translateText = dpz.loyalty.getActivityString(o.TransactionType);
                                    o.displayCustomerService = o.TransactionType === "EXPIRATION";
                                    a.History[e].PointStatus === "PENDING" ? (o.showBalance = false, n.push(o)) : p.push(o)
                                }
                                c.extend(f, {pendingHistory: n,completedHistory: p})
                            }
                            h(f)
                        } else
                            d()
                    },error: function() {
                        d()
                    },complete: function() {
                        site.func.toggleLoading(false, {}, {})
                    }})
            } else
                this.loyaltyIsOk() || d()
        },getActivityString: function(a) {
            if (a !== void 0 && a !== null && a !== "") {
                var b = a.toUpperCase();
                return this.config.history.translations[b] ? 
                this.config.history.translations[b] : a.replace("-", " ")
            }
            return "&nbsp"
        },isLoyaltyCoupon: function(a) {
            return "LoyaltyPoints" in jsDPZ.app.catalog.getCatalog().getCoupon(a).data.Tags
        },getBaseCoupon: function() {
            var a = jsDPZ.app.customer.getCustomer().data.Loyalty.LoyaltyCoupons;
            if (this.isEnrolled())
                for (var b = 0, c = a.length; b < c; b++) {
                    var d = a[b];
                    if (d.BaseCoupon)
                        return d
                }
            return {CouponCode: "",PointValue: 0,BaseCoupon: false}
        },updateLoyaltyStatus: function(a) {
            jsDPZ.app.customer.getCustomer().data.Session.loyaltyIsOk = 
            a;
            if (!a)
                for (var a = jsDPZ.app.order.getOrder().data, b = 0; b < a.Details.Coupons.length; b++)
                    dpz.loyalty.isLoyaltyCoupon(a.Details.Coupons[b].Code) && (a.Details.Coupons.splice(b, 1), b--);
            site.sessionTools.save({async: false});
            this.updateWidgets()
        },resetOrderEarnPoints: function() {
            this.loyaltyIsActive() && this.loyaltyIsOk() && this.isEnrolled() && (c.extend(true, jsDPZ.app.order.getOrder().data.Details.Loyalty, {Potential: {Earn: jsDPZ.config.dataModel.ORDER.Details.Loyalty.Potential.Earn}}), site.sessionTools.save())
        }}
}(window, 
document, jQuery);
dpz.bounceback = function(a, b) {
    var c, d = function() {
        var a = 0;
        return function() {
            return "dpz_bounceback_" + a++
        }
    }();
    c = function() {
        return this
    };
    c.defaults = {global: {delayDuration: 5E3}};
    b.extend(c, {activatePromos: function(a, e, g) {
            var h, d, k;
            if (a && b.isArray(a)) {
                h = a.length;
                for (d = 0; d < h; d++)
                    k = a[d].Code, this.isValidRedeemable(k) && (new c)[k]({order: e,customer: g})
            }
        },isValidRedeemable: function(a) {
            return this.types[a] ? true : false
        }});
    c.types = {};
    c.instances = {};
    c.Type = function(a, b) {
        this.options = b;
        this.id = d();
        c.instances[this.id] = 
        this;
        this.init.call(this, a)
    };
    b.extend(c.Type.prototype, {init: function() {
            this.render(data);
            return this
        },render: function(a) {
            site.func.overlayToggle(true, this.options.view, {}, a)
        }});
    c.Type.add = function(a) {
        var e = this, g = function() {
            return e.apply(this, arguments)
        };
        g.prototype = b.extend(true, {}, e.prototype);
        b.extend(g.prototype, a);
        g.extend = c.Type.extend;
        if (a.name || e.prototype.name) {
            var h = a.name || e.prototype.name, d = c.defaults[e.prototype.name] ? b.extend(true, {}, c.defaults[e.prototype.name]) : {};
            c.defaults[h] = 
            b.extend(d, a.defaults);
            c.types[h] = g;
            c.prototype[h] = function(a, e) {
                var d = b.extend({}, c.defaults.global, c.defaults[h], e || {});
                return new g(a, d, this)
            }
        } else
            console.log("name not provided for this bounceback, so it hasn't been registered.");
        return e
    };
    return c
}(this, jQuery);
dpz.postorderupsell = function(a, b) {
    var c, d = Object.prototype.hasOwnProperty, f = function() {
        var a = 0;
        return function() {
            return "dpz_post_order_upsell_" + a++
        }
    }();
    c = function() {
        return this
    };
    c.defaults = {global: {}};
    b.extend(c, {activate: function(a) {
            var b = a.type;
            if (c.types[b])
                (new c)[b]({couponCode: a.couponCode,price: a.price,fantaOnly: a.fantaOnly,order: a.order,form: a.form,formData: a.formData,originalOrder: a.originalOrder,submitOriginalOrder: a.submitOriginalOrder}), c.isActive = true
        },getActivationType: function(a) {
            if (a.hasOwnProperty("AvailablePromos") && 
            a.AvailablePromos.hasOwnProperty("EndOfOrder")) {
                a.AvailablePromos.EndOfOrder = "8217";
                var a = a.AvailablePromos.EndOfOrder, b;
                for (b in c.types)
                    if (d.call(c.types, b) && c.types[b].prototype.getCouponCode() == a)
                        return b
            }
            return false
        },noDrink: function(a) {
            for (var a = a.Products, b = a.length, c = 0, d = jsDPZ.app.catalog.getCatalog(); c < b; c++)
                if (d.getProduct(d.getVariant(a[c].Code).data.ProductCode).data.ProductType == "Drinks")
                    return false;
            return true
        },hasCoupon: function(a, b) {
            for (var c = b.Order.Coupons, d = false, f = 0, l = c.length; f < 
            l; f++)
                if (c[f].Code == a) {
                    d = true;
                    break
                }
            return d
        },validPaymentType: function(a) {
            for (var b = 0, c = a.length, d = false; b < c; b++)
                if (a[b].Type === "GiftCard") {
                    d = true;
                    break
                }
            return !d
        }});
    c.types = {};
    c.isActive = false;
    c.instances = {};
    c.Type = function(a, b) {
        this.options = b;
        this.id = f();
        c.instances[this.id] = this;
        this.init.call(this, a)
    };
    b.extend(c.Type.prototype, {init: function() {
            this.render(data);
            return this
        },render: function(a) {
            site.func.overlayToggle(true, this.options.view, {}, a)
        },getType: function() {
            return this.name
        },getCouponCode: function() {
            return this.coupon
        }});
    c.Type.add = function(a) {
        var g = this, d = function() {
            return g.apply(this, arguments)
        };
        d.prototype = b.extend(true, {}, g.prototype);
        b.extend(d.prototype, a);
        d.extend = c.Type.extend;
        if (a.name || g.prototype.name) {
            var f = a.name || g.prototype.name, k = c.defaults[g.prototype.name] ? b.extend(true, {}, c.defaults[g.prototype.name]) : {};
            c.defaults[f] = b.extend(k, a.defaults);
            c.types[f] = d;
            c.prototype[f] = function(a, g) {
                var e = b.extend({}, c.defaults.global, c.defaults[f], g || {});
                return new d(a, e, this)
            }
        } else
            console.log("name not provided for this post order upsell, so it hasn't been registered.");
        return g
    };
    return c
}(this, jQuery);
(function(a) {
    a.dpz.postorderupsell.Type.add({name: "PostOrderCokeUpsell",coupon: "8217",defaults: {view: "PostOrderUpsellOverlay",webTrends: {}},init: function(a) {
            this.render(a);
            return this
        },validCoupon: function(a) {
            var c;
            simplr.controller.mRouteAndExecute("/order/coupons/new?code=" + a.couponCode + "&qty=1");
            site.data.payments = site.paymentTools.buildPaymentsObject(a.formData, site.data.giftCards);
            c = jsDPZ.app.catalog.isCouponActive(a.couponCode).Success ? true : false;
            simplr.controller.mRouteAndExecute("/order/coupons/" + a.couponCode + 
            "/delete");
            return c
        },hasItem: function(a, c) {
            var d = $.Deferred();
            c.valid = false;
            c.price = false;
            simplr.controller.mRouteAndExecute(site.func.buildURL({url: "#/order/variant/new?code=" + a + "&qty=1"}));
            jsDPZ.ajax.priceOrder({data: jsDPZ.app.order.getOrderForPowerData(),success: function(f) {
                    if (f.Order.Status > -1) {
                        for (var f = f.Order.Products, e = f.length, g = 0; g < e; g++)
                            if (f[g].Code == a) {
                                c.price = f[g].Price;
                                c.valid = true;
                                break
                            }
                        jsDPZ.app.order.setOrder(c.originalOrder);
                        site.sessionTools.save({async: false})
                    }
                    d.resolve(c)
                },error: function(a) {
                    site.func.powerCommunicationError();
                    d.resolve(a)
                },complete: function() {
                }});
            return d
        },validate: function(a) {
            var c = $.Deferred(), d = false, f = site.data.postOrderUpsellVariants[0];
            a.valid = false;
            that = this;
            a.couponCode && (a.couponCode == "menu" ? this.hasItem(f, a).then(function(a) {
                c.resolve(a)
            }) : this.validCoupon(a) ? setTimeout(function() {
                that.hasItem(f, a).then(function(a) {
                    c.resolve(a)
                })
            }, 1) : d = true);
            d && setTimeout(function() {
                c.resolve(a)
            }, 1);
            return c
        },render: function(a) {
            this.validate(a).then(function(a) {
                a.valid ? (site.func.genericOverlayToggle({show: true,
                    viewName: "postOrderUpsellOverlay",selector: "#postOrderUpsellOverlay",data: {fantaOnly: a.fantaOnly,variantPrice: a.price,checkoutForm: a.form,paymentType: a.formData.Payment_Type,orderAmounts: a.order.AmountsBreakdown,couponCode: a.couponCode}}), site.trigger.onPage({uri: "/en/pages/order/#/checkout/pre_placeorder_upsell",title: "Pre-Placeorder-Upsell",group: "Upsell",subGroup: "Pre-Placeorder-Upsell/coke-family"})) : (site.func.toggleLoading(true), a.submitOriginalOrder())
            })
        }})
})(this);
var Interface = function(a, b) {
    if (arguments.length != 2)
        throw Error("Interface constructor called with " + arguments.length + " arguments, but expected exactly 2.");
    this.name = a;
    this.methods = [];
    for (var c = 0, d = b.length; c < d; c++) {
        if (typeof b[c] !== "string")
            throw Error("Interface constructor expects method names to be passed in as a string.");
        this.methods.push(b[c])
    }
};
Interface.ensureImplements = function(a) {
    if (arguments.length < 2)
        throw Error("Function Interface.ensureImplements called with " + arguments.length + " arguments, but expected at least 2.");
    for (var b = 1, c = arguments.length; b < c; b++) {
        var d = arguments[b];
        if (d.constructor !== Interface)
            throw Error("Function Interface.ensureImplements expects two and above to be instances of Interface.");
        for (var f = 0, e = d.methods.length; f < e; f++) {
            var g = d.methods[f];
            if (!a[g] || typeof a[g] !== "function")
                throw Error("Function Interface.ensureImplements: object does not implement the " + 
                d.name + " interface. Method " + g + " was not found");
        }
    }
};
var PizzaDisplay = new Interface("PizzaDisplay", ["setTopping", "setToppings", "setCrustType", "toJSON"]);
(function(a) {
    a.fn.attrHide = function() {
        this.attr("hidden", "hidden");
        return this
    };
    a.fn.attrShow = function() {
        this.removeAttr("hidden");
        return this
    }
})(jQuery);
(function(a) {
    (function() {
        function b(b) {
            var e = a("#" + b.id);
            e.size() == 0 ? a("body").append('<div id="' + b.id + '" style="position: absolute;"></div>') : (e.removeClass(c).removeClass(d), a(b.closeSelector).unbind("click.layer.destroy." + b.id));
            var e = a("#" + b.id), g = !(b.xPos != null && b.yPos != null);
            g ? (b.keepCentered && e.addClass(d), a.layer.center(b.id)) : e.css("left", b.xPos + "px").css("top", b.yPos + "px");
            e.html(b.defaultContent);
            g && a.layer.center(b.id);
            a(b.closeSelector).bind("click.layer.destroy." + b.id, function(g) {
                g.preventDefault();
                a.layer.destroy({id: b.id,closeSelector: b.closeSelector})
            })
        }
        var c = "_centerLayer", d = "_keepCenterLayer";
        a.layer = {center: function(b) {
                if (b) {
                    var b = a("#" + b), e = b.width(), g = b.height(), h = window.innerWidth || document.documentElement.clientWidth, j = window.innerHeight || document.documentElement.clientHeight, k = 0, k = (h - e) / 2, k = k < 0 ? 20 : k;
                    k += window.pageXOffset !== void 0 ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
                    var l = 0, l = (j - g) / 2, l = l < 0 ? 20 : l;
                    l += window.pageYOffset !== void 0 ? 
                    window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                    (e > h || g > j) && b.hasClass(d) && b.removeClass(d).addClass(c);
                    b.css({top: l + "px",left: k + "px"})
                }
            },create: function(c) {
                var e = a.extend({ajax: null,callback: null,closeSelector: "#_layerClose",defaultContent: "",id: "_layer",isOverlay: false,keepCentered: false,xPos: null,yPos: null}, c);
                if (e.isOverlay)
                    e.id = e.id == "_layer" ? "_overlay" : e.id, e.closeSelector = e.closeSelector == "#_layerClose" ? "#_overlayClose" : e.closeSelector, e.xPos = 
                    0, e.yPos = 0;
                b(e);
                if (e.ajax != null) {
                    var g = e.ajax.success;
                    e.ajax.success = function(c, d) {
                        e.defaultContent = c;
                        b(e);
                        a.isFunction(g) && g(c, d)
                    };
                    a.ajax(e.ajax)
                } else
                    a.isFunction(e.callback) && e.callback();
                if (e.isOverlay)
                    a("#" + e.id).css({position: "fixed",width: "100%",height: "100%"}).on("click", function(a) {
                        a.preventDefault()
                    })
            },destroy: function(b) {
                b = a.extend({id: "_layer",closeSelector: "#_layerClose"}, b);
                b.id && (a("#" + b.id).remove(), a(b.closeSelector).unbind("click.layer.destroy." + b.id))
            }};
        a(function() {
            a(window).bind("resize.layer", 
            function() {
                a("." + d + ",." + c).each(function(b, e) {
                    a(e).addClass(d).removeClass(c);
                    a.layer.center(a(e).attr("id"))
                })
            }).bind("scroll.layer", function() {
                a("." + d).each(function(b, c) {
                    a.layer.center(a(c).attr("id"))
                })
            })
        })
    })();
    window.killConfig = {globalData: {},localData: {},isActive: function(a) {
            return (killConfig.globalData[a] || false) && (killConfig.localData[a] || false) && (dpz.market.marketConfig.killConfig[a] || false)
        },isMarketEnabled: function(a) {
            return (killConfig.globalData[a] || false) && (dpz.market.marketConfig.killConfig[a] || 
            false)
        },loadDependency: function(b) {
            var c = a.extend(true, {key: "",ajax: {url: "",dataType: "script",timeout: 3E3,success: function() {
                    },error: function() {
                    },complete: function() {
                    }},write: "",append: ""}, b);
            simplr.util.mEmpty(c.key) || (simplr.util.mEmpty(c.ajax.url) ? simplr.util.mEmpty(c.write) ? simplr.util.mEmpty(c.append) || a(function() {
                a("body").append(c.append)
            }) : document.write(c.write) : (b = a.extend(true, {}, c.ajax, {success: function(a) {
                    c.ajax.success(a)
                },error: function() {
                    killConfig.globalData[c.key] = false;
                    c.ajax.error()
                },
                complete: function() {
                    c.ajax.complete();
                    a.holdReady(false)
                }}), a.holdReady(true), a.ajax(b)))
        }};
    simplr.config.mToggleConsole(!simplr.util.mEmpty(simplr.util.mGetUrlParameter("console")));
    a(function() {
        a(document).on("click", ".js-trackedClick", function() {
            a(document).trigger("trackedClick", a(this))
        });
        a(document).on("click", ".js-toggleLang", function(b) {
            b.preventDefault();
            (b = simplr.util.mGetUrlParameter()) && delete b.marketUrl;
            window.location.search = a.param(a.extend({}, b, {lang: a(this).attr("href")}))
        });
        var b = 
        dpz.market.marketConfig.labelsValidator;
        a.validator.labels = {};
        a.extend(a.validator.labels, b);
        simplr.validation.mAddCodes(dpz.market.marketConfig.errors);
        site.data.messages = {};
        a("ul.message-template li").each(function() {
            var b = a(this).attr("id").split("-")[1];
            site.data.messages[b] = {};
            a(this).children().each(function() {
                site.data.messages[b][a(this).attr("data-role")] = a(this).text()
            })
        }).parent().remove();
        a(".site-nav__toggle--nav").on("click", site.func.toggleOffCanvasNav);
        a(".site-nav__untoggle-overlay").on("click", 
        site.func.hideOffCanvasPanels);
        window.addEventListener && window.addEventListener("hashchange", site.func.hideOffCanvasPanels, false);
        a(document).on("/order/validate/ /order/variant/update/ /order/variant/delete/", function() {
            site.func.notifyCartUpdate()
        });
        a(document).on("/order/variant/new/", function() {
            site.data.noScroll || site.func.animateScroll()
        });
        a.validator.setDefaults({onfocusout: false,groups: {birthDate: "Birth_Month Birth_Day",expirationDate: "Expiration_Month Expiration_Year"},errorPlacement: function(b, 
            d) {
                d.attr("name") == "Region" && b.appendTo("input[name='Region']");
                if (d.context && d.context.name)
                    site.trigger.onEvent({uri: "/error/" + d.context.name,title: "Error or Alert " + d.context.name,group: "Error",subGroup: d.context.name,eventType: "error"});
                var f = d.prev(), e = [], g = "grid__cell grid__cell--form-error label", h = false;
                if (d.attr("class")) {
                    var j;
                    j = d.is('[type="checkbox"], [type="radio"]') ? d.parent().attr("class").split(/\s+/) : d.attr("class").split(/\s+/);
                    a.each(j, function(a, b) {
                        b.match(/grid__cell--/) && (e.push(b), 
                        b.match(/--offset--/) && (h = true), b.match(/--custom-form-error--/) && e.push(b.replace(/--custom-form-error--/, "--form-error--")))
                    })
                }
                !h && f.length && f.attr("class") && (j = d.prev().attr("class").split(/\s+/), a.each(j, function(a, b) {
                    if (b.match(/grid__cell--/) && !b.match(/--offset--/)) {
                        var g = b.split(/--/), c = g.length - 1;
                        g[c] = g[c] == "one" ? "offset-zero" : "offset-" + g[c];
                        e.push(g.join("--"))
                    }
                }));
                e.length && (g += " " + e.join(" "));
                d.siblings("input, select").length > 0 ? d.attr("class").indexOf("grid__cell") !== -1 ? b.appendTo(d.parent()).wrap("<div class='" + 
                g + "'></div>") : b.appendTo(d.parent()) : d.is('[type="radio"], [type="checkbox"]') ? b.insertAfter(d.parent()).wrap("<div class='" + g + "'></div>") : d.attr("class").indexOf("grid__cell") !== -1 ? b.insertAfter(d).wrap("<div class='" + g + "'></div>") : b.insertAfter(d)
            }});
        require(["dpz.config"], function(b) {
            var d = RegExp(b.getMarketProperty("mask").phone.regex), f = RegExp(b.getMarketProperty("mask").zip.regex);
            a.validator.addMethod("phone", function(a, b) {
                return this.optional(b) || a.length > 9 && a.match(d)
            });
            jQuery.validator.addMethod("postalcode", 
            function(a, b) {
                return this.optional(b) || a.match(f)
            });
            a.validator.addMethod("rncNumber", function(a, b) {
                return this.optional(b) || a.match(/^\d{9}$|^\d{11}$/)
            });
            a.validator.addMethod("expirationdate", function(a, b, c) {
                return c
            });
            a.validator.addMethod("uniqueAddress", function(a, b, c) {
                for (var b = jsDPZ.app.customer.getCustomer().data.Addresses, a = a.toLowerCase(), c = typeof c === "boolean" ? "" : c.toLowerCase(), d = 0, f = b.length; d < f; d++) {
                    var l = b[d].Name.toLowerCase();
                    if (l === a && l !== c)
                        return false
                }
                return true
            });
            a.validator.addMethod("uniqueCard", 
            function(a, b, c) {
                for (var b = jsDPZ.app.customer.getCustomer().data.CreditCards, a = a.toLowerCase(), c = typeof c === "boolean" ? "" : c.toLowerCase(), d = 0, f = b.length; d < f; d++) {
                    var l = b[d].nickName.toLowerCase();
                    if (l === a && l !== c)
                        return false
                }
                return true
            });
            a.validator.addMethod("equalToCI", function(a, b, c) {
                return a.toLowerCase() === c.toLowerCase()
            });
            a.validator.addMethod("showOptional", function() {
                return true
            });
            a.validator.addMethod("inactive", function() {
                return true
            });
            a.validator.addMethod("persist", function() {
                return true
            })
        });
        a.validator.updateDisplay = function(b) {
            a(b).is("form") && a("input, select", b).each(function() {
                var d = a(this).rules(), f = a("label[for='" + a(this).attr("name") + "']", b), e = a(this).closest(".form__control-group");
                e.length !== 0 && (d.required === true ? (a(f).removeClass("optional"), e.show()) : d.required === false ? (a(f).addClass("optional"), d.showOptional === true ? e.show() : e.hide()) : (a(f).addClass("optional"), d.showOptional === false ? e.hide() : e.show()))
            })
        };
        a.extend(a.fn, {renderFields: function(b) {
                function d(b) {
                    var c = b.closest(".form__control-group"), 
                    g = a('label[for="' + b.attr("name") + '"]', c), d = b.rules();
                    d && (d.required || d.showOptional) ? (c.show(), g.toggleClass("optional", !d.required), d.inactive && b.is(":visible") ? (c.addClass("is-inactive"), b.hide().siblings(".hint").hide(), c = a("<span />").attr("data-name", b.attr("name")).text(b.val()), b.after(c)) : d.inactive === false && (b.show().siblings(".hint").show(), a('span[data-name="' + b.attr("name") + '"]', c).remove())) : (c.hide(), b.is(":hidden") && !d.persist && (b.is("[type='radio']") ? b.removeAttr("checked") : b.is("[type='hidden']") || 
                    b.hasClass("js-forceValue") || b.val("")))
                }
                this.is("form") && (b ? a("input, select", this).each(function() {
                    var b = a(this);
                    setTimeout(function() {
                        d(b)
                    })
                }) : a("input, select", this).each(function() {
                    d(a(this))
                }));
                return this
            },focusClass: function() {
                this.is("form") && (a("input, select", this).not("[type='checkbox'],[type='radio']").bind("focus", function() {
                    a(this).addClass("focus")
                }).bind("blur", function() {
                    a(this).removeClass("focus")
                }), a('input:not([type="radio"]):visible:first', this).focus(), a("select", this).not(".skip-first-opt-clear").each(function() {
                    a("option:first", 
                    this).val("")
                }));
                return this
            },serializeObject: function() {
                var b = {}, d = this.serializeArray();
                a.each(d, function() {
                    b[this.name] !== void 0 ? (b[this.name].push || (b[this.name] = [b[this.name]]), b[this.name].push(this.value || "")) : b[this.name] = this.value === "on" ? true : this.value || ""
                });
                return b
            }})
    });
    (function(a) {
        window.BlockLoader = function() {
            function c(g) {
                if (site.data.cmsHTMLReady) {
                    var c, d = a('*[data-id="' + g.id + '"]', window.CmsHTML.document);
                    for (i = 0, iL = d.length; i < iL; i++)
                        if (f(a(d[i]))) {
                            c = a(d[i]);
                            break
                        }
                    c = e(c);
                    a.isFunction(g.callback) ? 
                    g.callback.call(g.scope || this, c) : (g.data = c, BlockLoader.insert(g))
                } else
                    a("#js-cmsHTML").size() == 0 && (c = '<iframe style="display:none;" id="js-cmsHTML" name="CmsHTML" src="' + g.url + '" />', a("body").append(c), a("#js-cmsHTML").load(function() {
                        site.data.cmsHTMLReady = true
                    })), setTimeout(function() {
                        BlockLoader.request(g)
                    }, 100)
            }
            function d(g, c, d) {
                var f = a("<div>");
                if (typeof c === "string")
                    return c = a(c), a.each(c, function(a, b) {
                        f.append(b)
                    }), e(a(d, f).html(a(g).html()).parents().html());
                else if (typeof c === "object")
                    return c = 
                    c.clone(), e(a(d, c).html(a(g).html()).parents())
            }
            function f(a) {
                var b = 3;
                jsDPZ.ajax.storeProfile({StoreID: jsDPZ.app.customer.getCustomer().getSessionData().StoreID,success: function(a) {
                        jsDPZ.app.store.setStoreFromPower(a)
                    },error: function() {
                        site.func.powerCommunicationError()
                    },complete: function() {
                        b--
                    },async: false});
                var c = jsDPZ.app.store.getStore().data.StoreAsOfTime.split("-"), d = c[2].split(" "), e = d[1].split(":");
                d.splice(1);
                c.splice(2);
                c = c.concat(d, e);
                c = new Date(c[0], c[1] - 1, c[2], c[3], c[4], c[5]);
                d = a.data("start");
                a = a.data("end");
                return new Date(c) >= new Date(d) && new Date(c) < new Date(a)
            }
            function e(g) {
                var c;
                typeof g === "object" ? a("img[src], a[href], object[data], param[value]", g).each(function(g, d) {
                    switch (a(d)[0].nodeName.toUpperCase()) {
                        case "A":
                            c = "href";
                            break;
                        case "IMG":
                            c = "src";
                            break;
                        case "OBJECT":
                            c = "data";
                            break;
                        case "PARAM":
                            c = "value"
                    }
                    a(d).attr(c, a(d).attr(c).replace(/\$\%7Bassets_ctx\%7D/gi, urlConfig.assets));
                    a(d).attr(c, a(d).attr(c).replace(/\$\%7Bctx\%7D/gi, urlConfig.root))
                }) : typeof g === "string" && (g = g.replace(/\$\%7Bassets_ctx\%7D/gi, 
                urlConfig.assets).replace(/\$\%7Bctx\%7D/gi, urlConfig.root));
                return g
            }
            return {request: function(g) {
                    g = a.extend({id: "",url: urlConfig.assets + "/blocks/content.html",scope: this}, g);
                    return c(g)
                },insert: function(g) {
                    g = a.extend({id: "",data: "",replace: true}, g);
                    if (!simplr.util.mEmpty(g.data)) {
                        var c = e(g.data.html());
                        a("#" + g.id).html(c);
                        g.replace == true && a("#" + g.id).children().first().unwrap()
                    }
                },load: function(g) {
                    g = a.extend({id: ""}, g);
                    BlockLoader.request(g)
                },shim: function(a, b, c) {
                    return d(a, b, c)
                }}
        }()
    })(jQuery);
    (function(a) {
        var c = 
        {begin: "#FF0000",end: "#E5EDF3",duration: 1E3,fps: 20}, d = {init: function(f) {
                f && a.extend(c, f);
                this.each(function() {
                    var e = a(this);
                    if (c.begin.length == 6)
                        c.begin = "#" + c.begin;
                    if (c.end.length == 6)
                        c.end = "#" + c.end;
                    if (!c.duration)
                        c.duration = 1E3;
                    if (!c.fps)
                        c.fps = 20;
                    c.duration = parseFloat(c.duration);
                    c.fps = parseFloat(c.fps);
                    var g = Math.ceil(1E3 / c.fps), h = Math.ceil(c.duration / g);
                    for (i = 1; i <= h; i++)
                        (function() {
                            var a = i, b = d.cssColor2rgb(c.begin), f = d.cssColor2rgb(c.end), m = f[0] - b[0], n = f[1] - b[1], p = f[2] - b[2];
                            timer = setTimeout(function() {
                                var g = 
                                d.ease(a, b[0], m, h), c = d.ease(a, b[1], n, h), f = d.ease(a, b[2], p, h), g = "rgb(" + parseInt(g) + "," + parseInt(c) + "," + parseInt(f) + ")";
                                e.css({"background-color": g})
                            }, g * a)
                        })()
                })
            },d2h: function(a) {
                return a.toString(16)
            },h2d: function(a) {
                return parseInt(a, 16)
            },rgb2h: function(a, b, g) {
                return [d.d2h(a), d.d2h(b), d.d2h(g)]
            },h2rgb: function(a, b, g) {
                return [d.h2d(a), d.h2d(b), d.h2d(g)]
            },cssColor2rgb: function(a) {
                return a.indexOf("rgb") <= -1 ? d.h2rgb(a.substring(1, 3), a.substring(3, 5), a.substring(5, 7)) : a.substring(4, a.length - 1).split(",")
            },
            ease: function(a, b, g, c) {
                return b + g * (a / c)
            }};
        a.fn.animateColor = function(f, e) {
            var g = f || "init";
            d[g] ? d[g].apply(this, Array.prototype.slice.call(arguments, 1)) : typeof g === "object" || !g ? d.init.apply(this, arguments) : a.error("Method " + g + " does not exist on jQuery.animateColor");
            if (typeof e === "function")
                return setTimeout(e, c.duration)
        }
    })(jQuery);
    simplr.trigger.mSetEnvironment(envConfig);
    (function() {
        var b, c;
        function d(g) {
            g = a.extend({delay: 350}, g);
            clearTimeout(b.queue);
            b.queue = setTimeout(function() {
                if (c.generic.length > 
                0)
                    c.generic[c.generic.length - 1](), c.generic = [];
                if (c.loading.length > 0)
                    c.loading[c.loading.length - 1](), c.loading = [];
                if (c.block1.length > 0)
                    c.block1[c.block1.length - 1](), c.block1 = [];
                if (c.block2.length > 0)
                    c.block2[c.block2.length - 1](), c.block2 = []
            }, g.delay)
        }
        function f(b, c, d, e) {
            b ? c.push(function() {
                a.layer.create(a.extend(e, {id: d}))
            }) : c.push(function() {
                a.layer.destroy({id: d})
            })
        }
        c = {loading: [],block1: [],block2: [],generic: []};
        b = {queue: null};
        var e = window.site = {data: {hash: {wait: false,init: ""},uiConfig: {AVAILABLE_LOCATIONS_ARRAY: [],
                    AVAILABLE_LOCATIONS_HASH: {},AVAILABLE_PARTS_CLASS_ARRAY: [],AVAILABLE_PARTS_CLASS_HASH: {},AVAILABLE_WEIGHTS_ARRAY: [],AVAILABLE_WEIGHTS_HASH: {},AVAILABLE_FEEDSIZE_ARRAY: [],AVAILABLE_FEEDSIZE_HASH: {},AVAILABLE_TITLETAGS: {},ADJUSTMENT_THRESHOLD: 0},lastOrder: {},defaultPizzaSize: 14,transactionRecords: 0,tmpOrder: {},noCheeseUpSell: false,ui: {hidePromoField: false,behavior: {suppressPlaceOrder: false}},noScroll: false,ABData: {upsellAtHomepage: false,upsellAtBasket: false,savingsHeader: false,productUpsellHeader: "",
                    priceMyOrder: {},hideDippingCups: false,keepMeSignedIn: {},specialtyChicken: {},showInlineUpsell: false,showBuilder: false,shopRunnerRendered: false,moveGOBYO: false,newCouponWizard: true,experience: "",youSaved: "",fiftyOffExperience: ""},customerLoginOverlay: "pizzaProfileLoginOverlay",breakpoint: {previousBreakpoint: null,resizeTimer: null,handheldMaxSize: 640},specialtyChickenCodes: ["CKRGCBT", "CKRGHTB", "CKRGSJP", "CKRGSBQ"]},initPage: function() {
            },trigger: {onPage: function(b) {
                    b = a.extend(true, {path: location.protocol + 
                        "//" + location.host + location.pathname,route: {route: [],url: "",base: "",resources: {},action: "",parameters: {}}}, b);
                    jsDPZ.topic("site.onPage").publish(b);
                    simplr.trigger.mOnPage({data: b})
                },onEvent: function(b) {
                    b = a.extend(true, {breadcrumb: ["UNKNOWN"],data: {}}, b);
                    simplr.trigger.mOnEvent({data: b})
                },onTransaction: function(b) {
                    b = a.extend(true, {}, jsDPZ.config.dataModel.ORDER, b);
                    simplr.trigger.mOnTransaction({data: b})
                }},format: {phoneNumber: function(b) {
                    for (var c = a.extend({number: "",format: "#(###) ###-####"}, b), b = 
                    c.number.replace(/\D/g, ""), c = c.format, d = "", e = b.length - 1, f = c.length - 1; f >= 0; f--)
                        c.charAt(f) == "#" && e >= 0 ? (d = b.charAt(e) + d, e--) : c.charAt(f) != "#" && (d = c.charAt(f) + d);
                    return d = d.replace("()", "")
                }},func: {stackAttack: function(b) {
                    a(".stackAttack", b).each(function() {
                        var b = a(this).text();
                        a(this).html("<span class='sa1'>" + b + "<span class='sa2'>" + b + "</span></span>")
                    })
                },unhideDelayedABTiles: function() {
                    a(".ABDelayedTile").removeClass("ABDelayedTile")
                },toggleTrackerTile: function(a, b) {
                    for (var c = 0, d = e.data.trackerTiles.length; c < 
                    d; c++)
                        if (e.data.trackerTiles[c].tilePromoName === a)
                            e.data.trackerTiles[c].isActive = function() {
                                return b
                            }
                },getValidTrackerTiles: function(a) {
                    for (var b = [], c = 0, d = a.length; c < d; c++)
                        a[c].isActive() && e.func.isTimedContent(a[c].startDate, a[c].endDate, function() {
                            b.push(a[c])
                        });
                    return b
                },isTimedContent: function(a, b, c) {
                    var d = new Date;
                    d >= a && d <= b && c(d)
                },inDateRange: function(a, b) {
                    if (!jsDPZ.util.empty(a)) {
                        var c = jsDPZ.obj.dateTime(a).data;
                        if (!jsDPZ.util.empty(b) && c >= jsDPZ.obj.dateTime(b).data)
                            return false
                    }
                    return true
                },
                isNewUserForBounceBack: function() {
                    return getCookie("returnUser") ? false : true
                },setPizzaBuilder: function(b) {
                    if (data = b || e.func.pizzaBuilderConfig)
                        e.func.pizzaBuilderConfig = data;
                    b = (b = window.location.href.toString().match(/lang=([a-z]{2})/)) ? b[1] : a("html").attr("lang");
                    data.buttons && (data.buttons.addToOrder && (data.buttons.addToOrder.textColor && a(".js-addToOrder", "#pizzaBuilderPage").css({color: data.buttons.addToOrder.textColor,"border-color": data.buttons.addToOrder.textColor}), data.buttons.addToOrder.backgroundColor && 
                    a(".js-addToOrder", "#pizzaBuilderPage").css("background-color", data.buttons.addToOrder.backgroundColor), data.buttons.addToOrder.cta && a(".js-addToOrder", "#pizzaBuilderPage").html(data.buttons.addToOrder.cta[b]), data.buttons.addToOrder.position === "bottomRight" && (a(".js-addToOrderVariantDetails", "#pizzaBuilderPage").addClass("test").hide(), a(".js-addToOrderBottomRight", "#pizzaBuilderPage").addClass("test").show())), data.buttons.next && (data.buttons.next.textColor && a(".js-next", "#pizzaBuilderPage").css({color: data.buttons.next.textColor,
                        "border-color": data.buttons.next.textColor}), data.buttons.next.backgroundColor && a(".js-next", "#pizzaBuilderPage").css("background-color", data.buttons.next.backgroundColor), data.buttons.next.cta && a(".js-next", "#pizzaBuilderPage").html(data.buttons.next.cta[b]), data.buttons.next.position === "variantDetails" && (a(".js-nextBottomRight", "#pizzaBuilderPage").hide(), a(".js-nextVariantDetails", "#pizzaBuilderPage").show())), data.buttons.back && (data.buttons.back.textColor && a(".js-prev", "#pizzaBuilderPage").css({color: data.buttons.back.textColor,
                        "border-color": data.buttons.back.textColor}), data.buttons.back.backgroundColor && a(".js-prev", "#pizzaBuilderPage").css("background-color", data.buttons.back.backgroundColor), data.buttons.back.cta && a(".js-prev", "#pizzaBuilderPage").html(data.buttons.back.cta[b])));
                    data.upsellCheckbox && (a(".js-upsellCheckboxActivate", "#pizzaBuilderPage").show(), data.upsellCheckbox.textColor && a(".js-upsellCheckbox", "#pizzaBuilderPage").css({color: data.upsellCheckbox.textColor,"border-color": data.upsellCheckbox.backgroundColor}), 
                    data.upsellCheckbox.backgroundColor && a(".js-upsellCheckbox .upsellMessage", "#pizzaBuilderPage").css("background-color", data.upsellCheckbox.backgroundColor), data.upsellCheckbox.cta && a(".js-upsellCheckbox .copy", "#pizzaBuilderPage").html(data.upsellCheckbox.cta[b]))
                },pizzaBuilderConfig: {},setOrderCheckout: function(b) {
                    if (data = b || e.func.orderCheckoutConfig)
                        e.func.orderCheckoutConfig = data;
                    data.beverageUpsell && a.extend(true, e.data.beverageUpsell, data.beverageUpsell);
                    if (data.productUpsell && (e.data.ABData.upsellAtBasket = 
                    data.productUpsell.location == "basket", data.productUpsell.noPrice && a("#upsellProductOverlay .js-noPrice").hide(), data.productUpsell.header))
                        e.data.ABData.savingsHeader = true, e.data.productUpsellHeader = data.productUpsell.header
                },orderCheckoutConfig: {},isPromoActive: function(a, b) {
                    var c = new Date;
                    return c >= a && c < b
                },overlayToggle: function(b, h, j, k, l) {
                    function m(b) {
                        var b = {defaultContent: b,callback: function() {
                                simplr.view.mData().Views[h].callback("#genericOverlay", k);
                                typeof l === "function" && l()
                            }}, g = a.extend({id: "genericOverlay",
                            keepCentered: false,xPos: 0,yPos: simplr.ui.mWindowInfo().offsets[1] + 30,defaultContent: "",callback: function() {
                            }}, b, g);
                        c.block = [];
                        f(true, c.generic, "genericOverlay", g);
                        f(true, c.block1, "overlayUIBlock1", {id: "overlayUIBlock1",isOverlay: true});
                        d({delay: 1})
                    }
                    if (j && j.viewComponent)
                        k.viewComponent = j.viewComponent;
                    e.func.toggleLoading(false);
                    b ? jsDPZ.util.empty(simplr.view.mData().Views[h]) || (b = simplr.view.mData().Views[h].html(k), simplr.util.mIsPromise(b) ? b.done(function(a) {
                        m(a)
                    }) : m(b)) : (f(false, c.generic, "genericOverlay"), 
                    f(false, c.block1, "overlayUIBlock1"), e.func.bubbleOverlayToggle(false), d({delay: 1}))
                },toggleLoading: function(a) {
                    a ? (f(true, c.loading, "loadingOverlay", {id: "loadingOverlay",keepCentered: true}), f(true, c.block2, "overlayUIBlock2", {id: "overlayUIBlock2",isOverlay: true})) : (f(false, c.loading, "loadingOverlay"), f(false, c.block2, "overlayUIBlock2"));
                    d()
                },setupContentPopups: function(b) {
                    a(".js-isContentPopup", b).on("click", function(b) {
                        b.preventDefault();
                        e.func.overlayToggle(true, "contentOverlay", {}, {url: a(this).attr("href")})
                    })
                },
                setupExecuteURL: function() {
                    a(".js-mExecute").live("click", function(b) {
                        var c = a(this).attr("href");
                        b.preventDefault();
                        simplr.controller.mRouteAndExecute(e.func.buildURL({url: c}))
                    })
                },setupTemplatePopups: function(b, c) {
                    var d = c && c.klass ? c.klass : "";
                    a(b).on("click", ".js-isTemplatePopup", function(b) {
                        b.preventDefault();
                        e.func.overlayToggle(true, "contentOverlay", {}, {template: a(this).attr("data-template-popup"),klass: d})
                    })
                },bubbleOverlayToggle: function(b, c, d) {
                    var f = a.extend(true, {}, c);
                    b ? (e.trigger.onEvent({uri: "/error/" + 
                        d.code,title: "Error or Alert " + d.code,group: "Error",subGroup: d.code,eventType: "error"}), b = {defaultContent: simplr.view.mData().Views.bubbleCodeOverlay.html(d),callback: function() {
                            simplr.view.mData().Views.bubbleCodeOverlay.callback("#bubbleOverlay", d);
                            if (f.yPos + a("#bubbleOverlay").outerHeight() > a(window).height() + a(window).scrollTop())
                                f.yPos = a(window).height() - a("#bubbleOverlay").outerHeight() + a(window).scrollTop(), a("#bubbleOverlay").css({top: f.yPos + "px"})
                        }}, c = a.extend({id: "bubbleOverlay",keepCentered: false,
                        defaultContent: "",callback: function() {
                        }}, b, c), simplr.ui.layer.mCreate(c)) : a("#bubbleOverlay").fadeOut(function() {
                        simplr.ui.layer.mDestroy({id: "bubbleOverlay"})
                    })
                },visualPizzaBubbleOverlayToggle: function(b, c) {
                    if (b) {
                        var d = {defaultContent: simplr.view.mData().Views.visualPizzaBubbleOverlay.html(c),callback: function() {
                                simplr.view.mData().Views.visualPizzaBubbleOverlay.callback("#visualPizzaBubbleOverlay", c)
                            }}, e = a("#pizzaCanvas").offset(), d = a.extend({id: "visualPizzaBubbleOverlay",xPos: e.left + 90,yPos: e.top + 
                            110,keepCentered: false,defaultContent: "",callback: function() {
                            }}, d);
                        simplr.ui.layer.mCreate(d)
                    } else
                        a("#visualPizzaBubbleOverlay").fadeOut(function() {
                            simplr.ui.layer.mDestroy({id: "visualPizzaBubbleOverlay"})
                        })
                },hideOverlayCloseButton: function() {
                    a(".js-closeButton").remove()
                },genericOverlayToggle: function(b) {
                    var h = a.extend({show: true,viewName: "genericOverlay",selector: "#genericOverlay",overlaySettings: {},UIBlockID: "overlayUIBlock1",data: {},callback: a.noop}, b);
                    e.func.toggleLoading(false);
                    h.show ? (b = {}, 
                    jsDPZ.util.empty(simplr.view.mData().Views[h.viewName]) || (b = {defaultContent: simplr.view.mData().Views[h.viewName].html(h.data),callback: function() {
                            simplr.view.mData().Views[h.viewName].callback(h.selector, h.data);
                            h.callback(h)
                        }}), b = a.extend({id: h.viewName,keepCentered: false,defaultContent: "",callback: function() {
                        }}, b, h.overlaySettings), c.block = [], f(true, c.generic, h.viewName, b), f(true, c.block1, h.UIBlockID, {id: h.UIBlockID,isOverlay: true})) : (f(false, c.generic, h.viewName, h.callback()), f(false, c.block1, 
                    h.UIBlockID), e.func.bubbleOverlayToggle(false));
                    d({delay: 1})
                },setupLayerCloseEvents: function(b) {
                    var c = a.extend({closeSelector: ".js-closeButton",layerSelector: "#_layer",callback: function() {
                        }}, b);
                    a(c.closeSelector, c.layerSelector).click(function(a) {
                        a.preventDefault();
                        e.func.overlayToggle(false);
                        c.callback(this)
                    })
                },doLoginRedirectAndShowPopup: function(b, c) {
                    function d() {
                        simplr.cookie.mSet({name: "homepageRedirect",value: "true",domain: ".dominos.com"});
                        window.location = urlConfig.localRoot + "/index.jsp"
                    }
                    var f = 
                    a.extend({evt: b,forceRedirect: false}, c);
                    if (f.forceRedirect)
                        d();
                    else
                        switch (window.location.hostname) {
                            case "www-dev.dominos.com":
                            case "www-qa.dominos.com":
                            case "www-qa2.dominos.com":
                            case "www-qa3.dominos.com":
                            case "www-qa4.dominos.com":
                            case "www-preprod.dominos.com":
                            case "www-prod1.dominos.com":
                            case "www-prod2.dominos.com":
                            case "www-prod3.dominos.com":
                            case "www-prod1.dominos.com":
                            case "www.dominos.com":
                                a(document).trigger("beforeLoginRedirect", f);
                                d();
                                break;
                            default:
                                e.func.showLoginPopup(f)
                        }
                },showLoginPopup: function(b) {
                    var c = 
                    {group: "Account",subGroup: "Sign In",title: "Account - Sign In",uri: "/account/signin"};
                    b && b.trigger && a.extend(c, b.trigger);
                    e.trigger.onEvent(c);
                    e.func.overlayToggle(true, e.data.customerLoginOverlay, {}, a.extend(true, {}, b))
                },powerCommunicationError: function() {
                    e.func.overlayToggle(true, "codeOverlay", {}, {code: "ePowerCommunication"})
                },buildOptionList: function(b) {
                    var c = a.extend({listValues: [],defaultValue: 0}, b), d = "";
                    a.each(c.listValues, function(a, b) {
                        d += "<option " + (b.value == c.defaultValue ? "selected " : "") + 
                        'value="' + b.value + '">' + b.label + "</option>"
                    });
                    return d
                },buildQtyOptionList: function(a) {
                    for (var b = [], c = 1; c <= jsDPZ.config.app.MAX_QUANTITY; c++)
                        b.push({value: c,label: c});
                    return e.func.buildOptionList({listValues: b,defaultValue: a})
                },buildSideOptionList: function(a) {
                    for (var b = [], c = 0; c <= jsDPZ.config.app.MAX_SIDE_QTY; c++)
                        b.push({value: c,label: c});
                    return e.func.buildOptionList({listValues: b,defaultValue: a})
                },buildURL: function(b) {
                    var c = a.extend({url: "",parameters: ""}, b), b = "";
                    if (c.url) {
                        c.url.charAt(0) != "/" && 
                        (b = c.url.slice(c.url.indexOf("#") + 1));
                        var c = c.parameters, d;
                        for (d in c)
                            if (typeof c[d] !== "undefined" && c.hasOwnProperty(d)) {
                                var e = b.indexOf("?") != -1 ? "&" : "?";
                                b += e + d + "=" + encodeURIComponent(c[d])
                            }
                    }
                    return b
                },doWhenVisible: function(b, c, d) {
                    var e = a(b), f, m = false, b = "event" + Math.floor(Math.random() * 10000001);
                    scrollEvent = "scroll." + b;
                    visibleEvent = "visible." + b;
                    var n = function(b) {
                        var b = a(b).offset().top + a(b).outerHeight(), c = a(window).innerHeight(), g = a(window).scrollTop();
                        return b < c + g
                    }, p = function() {
                        a(document).off(scrollEvent);
                        a(document).off(visibleEvent)
                    };
                    a(document).on(visibleEvent, function() {
                        c();
                        m = true;
                        d && (clearTimeout(f), p())
                    });
                    n(e) && a(document).trigger(visibleEvent);
                    if (!d || !m)
                        a(document).on(scrollEvent, function() {
                            f && clearTimeout(f);
                            f = setTimeout(function() {
                                n(e) && a(document).trigger(visibleEvent)
                            }, 200)
                        });
                    return {events: {scroll: scrollEvent,visible: visibleEvent},eventNameSpace: b,unbind: p}
                },customerLoggedIn: function() {
                    return !jsDPZ.util.empty(jsDPZ.app.customer.getCustomer().data.PasswordHash)
                },customerSemiLoggedIn: function() {
                    return !e.func.customerLoggedIn() && 
                    e.storage.load("CID") ? true : false
                },isGroupOrderingAvailable: function() {
                    var a = simplr.util.mGetUrlParameter("groupOrder") || false;
                    return (killConfig.isActive("groupOrdering") || a) && e.func.hasGroupOrderingProducts()
                },hasGroupOrderingProducts: function() {
                    var a = jsDPZ.app.catalog.getCatalog().data;
                    return !jsDPZ.util.empty(a.PreconfiguredProducts)
                },hasGroupOrderingCoupons: function() {
                    var a = jsDPZ.app.catalog.getCatalog().data, b = false;
                    !jsDPZ.util.empty(a.CouponTiers.MultiplePizza) && (b = !jsDPZ.util.empty(a.CouponTiers.MultiplePizza.Coupons));
                    return b
                },isUsingGroupOrderingCoupons: function() {
                    return !jsDPZ.util.empty(jsDPZ.app.order.getOrder().data.Tags) ? jsDPZ.app.order.getOrder().data.Tags.usingGroupOrderingCoupons : false
                },isGroupOrdering: function() {
                    return !jsDPZ.util.empty(jsDPZ.app.order.getOrder().data.Tags) ? jsDPZ.app.order.getOrder().data.Tags.GroupOrdering : false
                },showDiscountDashboard: function(b) {
                    var c = simplr.util.mGetUrlParameter("groupOrder") || false;
                    e.func.hasGroupOrderingCoupons() && e.func.isGroupOrdering() && !a("#discountDashboard").is(":visible") && 
                    (killConfig.isActive("groupOrdering") || c) ? (a(".pageLeftColumn").addClass("discountDashboard"), simplr.view.mRender({name: "discountDashboard",data: b,selector: "#js-discountDashboard"}), e.func.isHandheld() || (e.func.positionDiscountDashboard(), a(document).scroll(function() {
                        var b = a("#dashboardContent").is(":visible") ? e.data.ABData.abstep3 && e.func.isOnCheckoutPage() ? -35 : 10 : 0;
                        a("#discountDashboard").addClass("animation");
                        a("#discountDashboard").css("bottom", function() {
                            var c = a("#pageContent"), c = c.offset().top + 
                            c.height() - window.innerHeight - window.pageYOffset + 20;
                            return c < 0 ? e.data.ABData.abstep3 && e.func.isOnCheckoutPage() ? 0 + b - 35 : 0 + b : c
                        })
                    }))) : e.func.setDiscountDashboardNavButtons(b)
                },setDiscountDashboardNavButtons: function(b) {
                    a(".content-nextButtons .btn").hide();
                    jsDPZ.util.empty(b.categoryParams) ? (a(".content-nextButtons .btn.js-gOBtn, .js-returnTo").show(), a(".js-nextStep").hide()) : b.categoryParams.category == "Pizza" && b.categoryParams.section == "GroupOrdering" ? (a(".content-nextButtons .btn.js-pizza, .js-nextStep").show(), 
                    a(".js-returnTo").hide()) : b.categoryParams.category == "Sides" && b.categoryParams.section == "GroupOrdering" ? (a(".content-nextButtons .btn.js-sides, .js-nextStep").show(), a(".js-returnTo").hide()) : (a(".content-nextButtons .btn.js-gOBtn, .js-returnTo").show(), a(".js-nextStep").hide())
                },positionDiscountDashboard: function() {
                    if (!e.func.isHandheld()) {
                        var b = a("#dashboardContent").is(":visible") ? e.data.ABData.abstep3 && e.func.isOnCheckoutPage() ? -35 : 10 : 0;
                        a("#discountDashboard").removeClass("animation");
                        a("#discountDashboard").css("bottom", 
                        0);
                        a("#discountDashboard").css("bottom", function() {
                            var c = a("#pageContent"), c = c.offset().top + c.height() - window.innerHeight - window.pageYOffset + 20;
                            return c < 0 ? e.data.ABData.abstep3 && e.func.isOnCheckoutPage() ? 0 + b - 35 : 0 + b : c
                        })
                    }
                },hasAllSpecialtyChicken: function(b) {
                    for (var c = jsDPZ.app.order.getOrder().data.Details.Variants, d = [], e = [], f = 0, m = c.length; f < m; f++)
                        d.push(c[f].Code);
                    f = 0;
                    for (m = b.length; f < m; f++)
                        a.inArray(b[f], d) == -1 && e.push(b[f]);
                    return e.length > 0 ? true : false
                },hasAnySpecialtyChicken: function(b) {
                    for (var c = 
                    jsDPZ.app.order.getOrder().data.Details.Variants, d = [], e = [], f = 0, m = c.length; f < m; f++)
                        d.push(c[f].Code);
                    f = 0;
                    for (m = b.length; f < m; f++)
                        a.inArray(b[f], d) > -1 && e.push(b[f]);
                    return e.length > 0 ? true : false
                },hasNationalCoupons: function(b) {
                    var c = ["9193", "9194"], d = false;
                    if (b.length == 0)
                        d = true;
                    else
                        for (var e = 0, f = b.length; e < f; e++)
                            a.inArray(b[e].Code, c) > -1 && (d = true);
                    return d
                },buildBirthDates: function(a) {
                    for (var b = '<option value=""> ' + (dpz.market.activeLanguageCode === "en" ? "day" : "d&iacute;a") + "</option>", c = 1, a = moment(a, 
                    "MM").daysInMonth(); c <= a; c++)
                        b += '<option value="' + c + '">' + c + "</option>";
                    return b
                },buildExpirationDropdown: function(a) {
                    var b = typeof a === "number" ? a : 0;
                    typeof a === "undefined" && (b = 17);
                    for (var a = (new Date).getFullYear(), c = '<option value="">year</option>', d = 0; d < b; d++)
                        c += '<option value="20' + (a + d).toString().slice(2, 4) + '">' + (a + d) + "</option>";
                    return c
                },setCreditCardType: function(b, c) {
                    var d = dpz.config.getMarketProperty("mask"), e = "", f = d && d.creditCardFourDigits ? d.creditCardFourDigits : {mask: "0000-0000-0000-0000",
                        properties: {}}, m = d && d.creditCodeThreeDigits ? d.creditCodeThreeDigits : {mask: "999",properties: {}};
                    /^5[1-5]/.test(b) ? e = "MASTERCARD" : /^4/.test(b) ? e = "VISA" : /^3746-22/.test(b) ? (e = "OPTIMA", f = d && d.creditCardFiveDigits ? d.creditCardFiveDigits : {mask: "9999-999999-99999",properties: {}}, m = d && d.creditCodeFourDigits ? d.creditCodeFourDigits : {mask: "9999",properties: {}}) : /^3[47]/.test(b) ? (e = "AMEX", f = d && d.creditCardFiveDigits ? d.creditCardFiveDigits : {mask: "9999-999999-99999",properties: {}}, m = d && d.creditCodeFourDigits ? d.creditCodeFourDigits : 
                    {mask: "9999",properties: {}}) : /^6(?:011|5)/.test(b) ? e = "DISCOVER" : /^(?:2131|1800|35)/.test(b) ? e = "JCB" : /^3(?:0[0-5]|[68])/.test(b) && (e = "DINERS", f = d && d.creditCardFiveDigits ? d.creditCardFiveDigits : {mask: "9999-999999-99999",properties: {}});
                    killConfig.isMarketEnabled("masksEnabled") && a(".js-creditCardType", c).val() !== e && (a(".js-creditCardNumber", c).mask(f.mask, f.properties), a(".js-securityCode", c).mask(m.mask, m.properties));
                    a(".js-creditCardType", c).val(e);
                    e ? a(".cardType .form__input--icon, .js-cardType .form__input--icon", 
                    c).filter("." + e).removeClass("nomatch").siblings(".form__input--icon").addClass("nomatch") : a(".cardType .form__input--icon, .js-cardType .form__input--icon", c).removeClass("nomatch")
                },saveAccountData: function(b) {
                    e.storage.save("customerFirstName", b.data.FirstName, 90);
                    b = a.extend({}, {success: function() {
                        },error: function() {
                        },complete: function() {
                        },data: {},statusCode: {}}, b);
                    e.func.toggleLoading(true);
                    jsDPZ.ajax.customerSave({data: b.data,success: function(c) {
                            var d = a.extend(true, {}, c);
                            jsDPZ.app.customer.setCustomerFromPower(c);
                            if (dpz.loyalty.loyaltyIsActive())
                                jsDPZ.app.order.getOrder().data.Details.Loyalty = a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Details.Loyalty);
                            e.sessionTools.save();
                            e.func.updateMinorNavigation();
                            b.success(d)
                        },error: function(a) {
                            e.trigger.onEvent({breadcrumb: ["Customer", "Save Error", a.status + " - " + a.statusText]});
                            var c = a.responseText, d = "powerCustomerGenericError";
                            c.StatusItems && (c.StatusItems[0].Field == "EmailAlreadyUsed" ? d = "powerCustomerEmailUsed" : c.StatusItems[0].Field == "NotAuthorized" && (d = "powerCustomer"));
                            e.func.overlayToggle(true, "codeOverlay", {}, {code: d});
                            b.error(a)
                        },statusCode: b.statusCode,complete: function(a) {
                            e.func.toggleLoading(false);
                            b.complete(a)
                        }})
                },updateMainNavigation: function(b) {
                    b = a.extend({main: "",sub: "",isContentPage: false}, b);
                    b.main == "groupOrdering" || e.data.ABData.hideHotDeals ? a("#js-hotDeals").hide() : a("#js-hotDeals").show();
                    a("#discountDashboard").is(":visible") && e.func.positionDiscountDashboard();
                    b && (simplr.view.mRender({name: "mainFooter",data: {main: b.main,sub: b.sub},selector: ".js-mainFooter"}), 
                    simplr.view.mRender({name: "mainNavigation",data: {main: b.main,sub: b.sub,isContentPage: b.isContentPage},selector: ".js-siteMainNavigation"}), b.main != "home" && simplr.view.mRender({name: "main_sub_navigation",data: {main: b.main,sub: b.sub,isContentPage: b.isContentPage},selector: "#js-subNavigationPage"}))
                },updateMinorNavigation: function() {
                    var b = jsDPZ.app.customer.getCustomer().data;
                    e.func.customerSemiLoggedIn() && !b.Email ? jsDPZ.ajax.customerLogin({data: {rememberMe: true},success: function(b) {
                            jsDPZ.app.customer.setCustomerFromPower(b);
                            if (dpz.loyalty.loyaltyIsActive())
                                jsDPZ.app.order.getOrder().data.Details.Loyalty = a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Details.Loyalty);
                            e.sessionTools.save({async: false})
                        },complete: function() {
                            b = jsDPZ.app.customer.getCustomer().data;
                            simplr.view.mRender({name: "headerProfile",data: b,selector: "#headerProfileContainer"})
                        }}) : simplr.view.mRender({name: "headerProfile",data: b,selector: "#headerProfileContainer"});
                    e.data.ABData.minorNavigationRendered = true;
                    a(document).trigger("minorNavigationRendered")
                },
                printRemote: function(b, c) {
                    var d = b.currentTarget.href;
                    a("#" + c).size() == 0 ? a("body:first").append('<iframe style="position:fixed;top:100;left:100;height:1px;width:1px;border:none;" id="' + c + '" name="' + c + '" src="' + d + '"></iframe>') : window.frames[c].contentWindow.location.reload(true)
                },imageExists: function(a) {
                    var b = new Image;
                    b.src = a;
                    return b.naturalWidth === 0 ? false : true
                },bounceBackTest: {startTest: function(a, b, c, d, e, f) {
                        this.mBox({location: a,upsellData: b,premarkup: c,promise: d,markup: function(a) {
                                return simplr.layout.mAssembleLayout({component: "checkoutComponent",
                                    tokens: a})
                            },ajaxCOS: e,orderData: f})
                    },mBox: function(a) {
                        parentThis = this;
                        this.isEligible(a) ? dpz.tnt.delayDoDefault(function(b) {
                            if (b && b.testClass === "bouncebackTest")
                                jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest = b, e.sessionTools.save();
                            jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest && jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.testClass === "bouncebackTest" && jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.passed.abtest != "control" ? parentThis.experienceGroup(a) : 
                            parentThis.defaultBehavior(a)
                        }, "Dominos-Global") : this.defaultBehavior(a)
                    },experienceGroup: function(b) {
                        var c = jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.header, d = jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.message, f = jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.experience;
                        jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.location == "waterfall" && b.location == "waterfall" ? e.func.overlayToggle(true, "newUserBouncebackOverlay", 
                        {}, {waterfall: "card--waterfalltest card--waterfalltest--bounceback-" + f,header: c,message: d,experience: f}) : jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.location != "waterfall" && b.location == "waterfall" && e.func.overlayToggle(true, "upsellProductOverlay", {keepCentered: true}, b.upsellData[0]);
                        jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.location == "inline" && b.location == "inline" ? (b.premarkup.header = jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.header, 
                        b.premarkup.message = jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.message, b.premarkup.experience = jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.experience, b.promise.resolve(b.markup(b.premarkup)), e.func.stackAttack(".confirm-bounceback__text")) : jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.location != "inline" && b.location == "inline" && (b.promise.resolve(b.markup(b.premarkup)), a(".confirm-bounceback--inline").addClass("none"));
                        jsDPZ.app.customer.getCustomer().data.Session.bouncebackTest.settings.location != 
                        "none" && b.location == "bounceback" && (setTimeout(function() {
                            e.func.overlayToggle(true, "newUserBouncebackOverlay", {}, {orderconfirmation: true,ajaxData: b.ajaxCOS})
                        }, 3E3), simplr.cookie.mSet({name: "returnUser",value: true,domain: "." + document.domain,expireDays: 25}))
                    },defaultBehavior: function(b) {
                        b.location == "waterfall" ? e.func.overlayToggle(true, "upsellProductOverlay", {keepCentered: true}, b.upsellData[0]) : b.location == "inline" ? (b.promise.resolve(b.markup(b.premarkup)), a(".confirm-bounceback--inline").addClass("none")) : 
                        b.location == "bounceback" && (this.isEligible(b) && setTimeout(function() {
                            e.func.overlayToggle(true, "newUserBouncebackOverlay", {}, {orderconfirmation: true,ajaxData: b.ajaxCOS})
                        }, 3E3), simplr.cookie.mSet({name: "returnUser",value: true,domain: "." + document.domain,expireDays: 25}))
                    },isEligible: function(a) {
                        return killConfig.isMarketEnabled("bounceBackTest") && e.func.inDateRange(jsDPZ.app.store.getStore().data.StoreAsOfTime, dpz.market.marketConfig.upsells.bounceBackTest[0].expiration) && (!e.isConfirmationPage || e.isConfirmationPage && 
                        a.orderData.Details.Amounts.Customer >= 20) ? true : false
                    }},updateProgressBar: function(b) {
                    if (killConfig.isMarketEnabled("progressBar") && b && b.main) {
                        var c = window.location.href;
                        if ({homePage: false,generic: c.indexOf("/pages/giftcard") > 0 || c.indexOf("/pages/customer/opt-in") > 0 || c.indexOf("/pages/customer/opt-out") > 0,locations: true,entrees: true,sides: true,drinks: true,coupons: true,groupOrdering: true,checkout: true,checkout: true,nutrition: true,terms: false,privacy: false,giftCards: true,nationalMenu: jsDPZ.app.store.getStore().data.StoreID !== 
                            "" || jsDPZ.app.customer.getCustomer().data.Session.StoreID !== ""}[b.main])
                            killConfig.isMarketEnabled("mBox") && dpz.tnt.send({mboxName: "Dominos-Global",mboxParams: {}}), dpz.tnt.delayDoDefault(function(b) {
                                b && b.testClass === "progressBar" && (jsDPZ.app.customer.getCustomer().data.Session["progress-bar__mbox"] = b, e.sessionTools.save());
                                if (jsDPZ.app.customer.getCustomer().data.Session["progress-bar__mbox"]) {
                                    var c = jsDPZ.app.customer.getCustomer().data.Session["progress-bar__mbox"], b = c.settings.experience === "c" || 
                                    c.settings.experience === "d", d = function() {
                                        var b = c.settings.experience, d = a(".progress-bar").parent();
                                        d.prop("id") === "pageContent" && !e.func.isHandheld() ? (a("body").prepend(a(".progress-bar")), b == "d" && a('header[role="banner"]').addClass("progress-bar__header--experience-d")) : d.is("body") && e.func.isHandheld() && (a("#pageContent").prepend(a(".progress-bar")), a("header").removeClass("progress-bar__header--experience-d"))
                                    };
                                    b && d();
                                    if (a(".progress-bar").children().length === 0) {
                                        if (simplr.view.mRender({name: "progressBar",
                                            data: {experience: c.settings.experience,renderSlimVersion: c.settings.experience === "d"},selector: ".progress-bar"}), b)
                                            a(document).on("/breakpoint/change/handheld/ /breakpoint/change/desktop/ ", d)
                                    } else
                                        simplr.view.mData().Views.progressBar.updateBarMarkup()
                                }
                            }, "Dominos-Global")
                    }
                },fixMissingImages: function(b) {
                    var c = false, d = envConfig == "localhost" || envConfig == "nolo-us-dev" || envConfig == "nolo-us-qa" || envConfig == "nolo-us-preprod";
                    a.each(b, function() {
                        this.onerror = function() {
                            if (typeof this.hasErrored === "undefined") {
                                var b = 
                                this.src;
                                this.src = b = b.substring(0, b.lastIndexOf("/") + 1) + "placeholder.jpg";
                                this.hasErrored = true
                            } else if (d && !c)
                                throw c = true, Error('[WARNING] - MISSING PLACEHOLDER IMAGE\n\nThe following directory is missing a "placeholder.jpg" image:\n' + this.src.substring(0, this.src.lastIndexOf("/") + 1) + '\n\nPlease add an appropriately sized "placeholder.jpg" image to the above directory.');
                            a("#discountDashboard").is(":visible") && e.func.positionDiscountDashboard()
                        }
                    })
                },formFocus: function() {
                    a("input, select").not("[type='checkbox'],[type='radio']").bind("focus", 
                    function() {
                        a(this).addClass("focus")
                    }).bind("blur", function() {
                        a(this).removeClass("focus")
                    })
                },setRedirect: function(a) {
                    e.storage.save("dpz_redirect_url", a || window.location.href)
                },tryRedirect: function(a) {
                    (redirectURL = e.storage.load("dpz_redirect_url")) ? e.storage.remove("dpz_redirect_url") : window.location.hash = a;
                    if (redirectURL)
                        window.location.href = redirectURL
                },segmentedContent: function(b, c, d) {
                    if (killConfig.isActive("googleAnalyticsContentExperiments"))
                        var e = 0, f = setInterval(function() {
                            if (utmx || ++e === 
                            10) {
                                var m = utmx_combination, n = simplr.util.mGetUrlParameter("abtest");
                                n && (m = n.charCodeAt() - 97);
                                a.inArray(m, b) > -1 ? "function" == typeof c && c(m) : "function" == typeof d && d(m);
                                clearInterval(f)
                            }
                        }, 100);
                    else
                        "function" == typeof d && d(-1)
                },initTileRotator: function(b) {
                    var c = a(b), d = c.length, e = 0;
                    c.eq(0).show();
                    d > 1 && setInterval(function() {
                        c.eq(e).fadeOut();
                        e = ++e % d;
                        c.eq(e).fadeIn()
                    }, 8E3)
                },isHandheld: function() {
                    var a = "screen and (max-width: " + e.data.breakpoint.handheldMaxSize + "px)";
                    return window.matchMedia && window.matchMedia(a) && 
                    window.matchMedia(a).matches
                },getCurrentBreakpoint: function() {
                    return window.getComputedStyle && document.body && window.getComputedStyle(document.body, ":after") ? window.getComputedStyle(document.body, ":after").getPropertyValue("content").replace(/'|"/g, "") : ""
                },toggleOffCanvasNav: function() {
                    a("body").toggleClass("is-handheld-nav-visible")
                },hideOffCanvasPanels: function() {
                    e.func.isHandheld() && a("body").removeClass("is-handheld-nav-visible is-handheld-cart-visible")
                },animateScroll: function(b, c, d) {
                    if (e.func.isHandheld() || 
                    d === true)
                        b = b || "body", c = c ? a(c).offset().top - 90 : 0, a(b).animate({scrollTop: c})
                },notifyCartUpdate: function() {
                    for (var b = jsDPZ.app.order.getOrder().data.Details.Variants, c = 0, d = b.length, f = 0; c < d; c++)
                        if (!b[c].hasOwnProperty("AutoRemove") || !b[c].AutoRemove)
                            f += b[c].Qty;
                    $jsCartIcon = a(".js-cart-icon");
                    $jsCartIcon.attr("data-order-qty", f);
                    f > 0 ? ($jsCartIcon.attr("data-has-order-qty", "true"), e.func.isHandheld() && ($jsCartIcon.removeAttr("data-has-order-qty"), setTimeout(function() {
                        $jsCartIcon.attr("data-has-order-qty", 
                        "true")
                    }, 0))) : $jsCartIcon.removeAttr("data-has-order-qty")
                },getExternalReferrer: function() {
                    var a = simplr.cookie.mGet({name: "externalReferrer"}), b = document.referrer.split("?")[0];
                    return document.referrer.length && (b.indexOf("pizza.dominos") !== -1 || b.indexOf(document.domain) === -1) && document.referrer !== a ? (simplr.cookie.mExpire({name: "externalReferrer"}), simplr.cookie.mSet({name: "externalReferrer",value: document.referrer,domain: "." + document.domain}), document.referrer) : a && a.length ? a : (simplr.cookie.mExpire({name: "externalReferrer"}), 
                    simplr.cookie.mSet({name: "externalReferrer",value: null,domain: "." + document.domain}), null)
                }},dataTools: {dataForLayout: function(b) {
                    if (jsDPZ.util.empty(b))
                        return {};
                    else {
                        var b = a.extend(true, {}, b), c = {};
                        a.each(b, function(b, d) {
                            var g = (b.charAt(0).toLowerCase() + b.slice(1)).replace(/_/g, "");
                            c[g] = jsDPZ.util.empty(d) ? d : a.isPlainObject(d) ? e.dataTools.dataForLayout(d) : typeof d === "boolean" ? d ? "true" : "false" : d
                        });
                        return c
                    }
                },dataForDPZ: function(b) {
                    if (jsDPZ.util.empty(b))
                        return {};
                    else {
                        var b = a.extend(true, {}, b), c = {};
                        a.each(b, function(b, d) {
                            var g = b.charAt(0).toUpperCase() + b.slice(1);
                            c[g] = jsDPZ.util.empty(d) ? d : a.isPlainObject(d) ? e.dataTools.dataForDPZ(d) : d == "true" || d == "false" ? d == "true" : d
                        });
                        return c
                    }
                }},storage: {save: function(a, b, c) {
                    c = (c || 1) * 864E5;
                    return simplr.browser.mLocalStorageCapable() ? simplr.cache.mSet({key: a,data: b,freshness: c}) : simplr.cookie.mSet({name: a,value: b})
                },load: function(a) {
                    a = simplr.browser.mLocalStorageCapable() ? simplr.cache.mGet({key: a}) : simplr.cookie.mGet({name: a});
                    a === "null" && (a = null);
                    return a
                },
                remove: function(a) {
                    return simplr.browser.mLocalStorageCapable() ? simplr.cache.mExpire(a) : simplr.cookie.mExpire({name: a})
                }},sessionTools: {sessionTimeout: setTimeout(function() {
                    if (e.func.customerLoggedIn()) {
                        var a = {doRedirect: "true"};
                        if (window.location.href.indexOf("confirmation.jsp") != -1 || window.location.href.indexOf("/pages/tracker/") != -1)
                            a.doRedirect = "false";
                        simplr.controller.mRouteAndExecute(e.func.buildURL({url: "#/customer/semilogout/",parameters: a}))
                    }
                }, 18E5),resetTimeout: function() {
                    clearTimeout(e.sessionTools.sessionTimeout);
                    e.sessionTools.sessionTimeout = setTimeout(function() {
                        if (e.func.customerLoggedIn()) {
                            var a = {doRedirect: "true"};
                            if (window.location.href.indexOf("confirmation.jsp") != -1 || window.location.href.indexOf("/pages/tracker/") != -1)
                                a.doRedirect = "false";
                            simplr.controller.mRouteAndExecute(e.func.buildURL({url: "#/customer/semilogout/",parameters: a}))
                        }
                    }, 18E5)
                },saveTimeout: null,load: function(b) {
                    if (Modernizr.localstorage) {
                        sessionStorage.Customer && jsDPZ.app.customer.setCustomer(simplr.conversion.mJSONStringToObject(sessionStorage.Customer));
                        sessionStorage.Order && jsDPZ.app.order.setOrder(simplr.conversion.mJSONStringToObject(sessionStorage.Order));
                        if (sessionStorage.LastOrder)
                            e.data.lastOrder = simplr.conversion.mJSONStringToObject(sessionStorage.LastOrder);
                        sessionStorage.Store && jsDPZ.app.store.setStore(simplr.conversion.mJSONStringToObject(sessionStorage.Store))
                    } else {
                        var b = a.extend({callback: function() {
                            },async: false}, b), c = e.storage.load("sessionID");
                        c != null && jsDPZ.ajax.sessionLoad({id: c,async: b.async,success: function(a) {
                                jsDPZ.app.customer.setCustomer(a.Customer);
                                jsDPZ.app.order.setOrder(a.Order);
                                e.data.lastOrder = a.LastOrder;
                                jsDPZ.app.store.setStore(a.Store)
                            },error: function(a) {
                                e.trigger.onEvent({title: "Error Page",group: "Error",subGroup: "Session Load Error " + a.status + " - " + a.statusText,eventType: "error"});
                                e.storage.remove("sessionID")
                            }});
                        b.callback()
                    }
                },save: function(b) {
                    if (Modernizr.localstorage)
                        sessionStorage.Customer = simplr.conversion.mObjectToJSONString(jsDPZ.app.customer.getCustomer().data), sessionStorage.Order = simplr.conversion.mObjectToJSONString(jsDPZ.app.order.getOrder().data), 
                        sessionStorage.LastOrder = simplr.conversion.mObjectToJSONString(e.data.lastOrder), sessionStorage.Store = simplr.conversion.mObjectToJSONString(jsDPZ.app.store.getStore().data);
                    else {
                        clearTimeout(e.sessionTools.saveTimeout);
                        var c = a.extend({callback: function() {
                            },async: true}, b), d = e.storage.load("sessionID") == null ? "" : e.storage.load("sessionID"), f = {Customer: jsDPZ.app.customer.getCustomer().data,Order: jsDPZ.app.order.getOrder().data,LastOrder: e.data.lastOrder,Store: jsDPZ.app.store.getStore().data}, l = function() {
                            jsDPZ.ajax.sessionSave({id: d,
                                data: f,async: c.async,success: function(a) {
                                    e.storage.save("sessionID", a)
                                },error: function(a) {
                                    e.trigger.onEvent({title: "Error Page",group: "Error",subGroup: "Session Save Error " + a.status + " - " + a.statusText,eventType: "error"});
                                    e.storage.remove("sessionID")
                                }});
                            c.callback()
                        };
                        c.async ? e.sessionTools.saveTimeout = setTimeout(function() {
                            l()
                        }, 100) : l()
                    }
                },remove: function(b) {
                    Modernizr.localstorage ? sessionStorage.clear() : (b = a.extend({callback: function() {
                        }}, b), e.storage.remove("sessionID"), b.callback())
                }},breakpoint: {startListener: function() {
                    e.data.breakpoint.previousBreakpoint = 
                    e.func.getCurrentBreakpoint();
                    a(window).resize(function() {
                        clearTimeout(e.data.breakpoint.resizeTimer);
                        e.data.breakpoint.resizeTimer = setTimeout(function() {
                            var b = e.func.getCurrentBreakpoint();
                            if (b != e.data.breakpoint.previousBreakpoint)
                                a(document).trigger("/breakpoint/change/" + (window.innerWidth <= e.data.breakpoint.handheldMaxSize ? "handheld" : "desktop") + "/"), e.data.breakpoint.previousBreakpoint = b
                        }, 35)
                    })
                }}};
        if (!simplr.util.mEmpty(simplr.util.mGetUrlParameter("reset")))
            e.sessionTools.remove(), simplr.browser.mLocalStorageCapable() && 
            localStorage.clear(), window.location = urlConfig.root + "/index.jsp";
        a(function() {
            a(document).on("/order/validate/", function() {
                e.data.ABData.priceMyOrder.hasOwnProperty("inTest") && e.data.ABData.priceMyOrder.inTest && e.data.ABData.priceMyOrder.autoPrice && simplr.controller.mRouteAndExecute("/order/price/")
            });
            a(document).on("/order/validate/", function() {
                e.data.ABData.priceMyOrder.hasOwnProperty("inTest") && e.data.ABData.priceMyOrder.inTest && e.data.ABData.priceMyOrder.autoPrice && simplr.controller.mRouteAndExecute("/order/price/")
            });
            require(["dpz.config", "dpz.template"], function(b, c) {
                window.dpz.config = b;
                window.dpz.template = c;
                var d = dpz.market.activeLanguageCode, f = "LTR";
                a("html").attr("lang", d);
                switch (d) {
                    case "ar":
                        f = "RTL";
                    default:
                        a("html").attr("dir", f)
                }
                e.func.updateMinorNavigation();
                e.func.setupExecuteURL();
                e.initPage();
                var l = setInterval(function() {
                    if (!e.data.hash.wait) {
                        clearInterval(l);
                        var b = window.location;
                        b.hash == "" && !jsDPZ.util.empty(e.data.hash.init) ? b.hash = e.data.hash.init : a(window).hashchange()
                    }
                }, 100);
                a("#discountDashboard").is(":visible") && 
                e.func.positionDiscountDashboard();
                e.data.uiConfig.AVAILABLE_LOCATIONS_HASH = dpz.market.marketConfig.pizzaBuilder.locationsHash;
                e.data.uiConfig.AVAILABLE_LOCATIONS_ARRAY = dpz.market.marketConfig.pizzaBuilder.locationsArray;
                e.data.uiConfig.AVAILABLE_PARTS_CLASS_HASH = dpz.market.marketConfig.pizzaBuilder.partsClassHash;
                e.data.uiConfig.AVAILABLE_PARTS_CLASS_ARRAY = dpz.market.marketConfig.pizzaBuilder.partsClassArray;
                e.data.uiConfig.AVAILABLE_WEIGHTS_HASH = dpz.market.marketConfig.pizzaBuilder.weightsHash;
                e.data.uiConfig.AVAILABLE_WEIGHTS_ARRAY = dpz.market.marketConfig.pizzaBuilder.weightsArray;
                e.data.uiConfig.AVAILABLE_FEEDSIZE_HASH = dpz.market.marketConfig.pizzaBuilder.feedSizeHash;
                e.data.uiConfig.AVAILABLE_FEEDSIZE_ARRAY = dpz.market.marketConfig.pizzaBuilder.feedSizeArray;
                jsDPZ.topic("print.remote.frame.ready").subscribe(function() {
                    a.isFunction(window.print) ? window.print() : window.contentWindow.print()
                });
                jsDPZ.topic("shoprunner.update").subscribe(function(b) {
                    var c = jsDPZ.app.order.getOrder().data;
                    jsDPZ.util.empty(b.sr_token) ? 
                    delete c.Partners.ShopRunner : c.Partners.ShopRunner = a.extend(jsDPZ.config.dataModel.PARTNER, {Code: "ShopRunner",Token: b.sr_token});
                    e.sessionTools.save();
                    e.func.isOnCheckoutPage() && simplr.controller.mRouteAndExecute("/order/price/?checkout=1")
                })
            });
            e.breakpoint.startListener()
        })
    })();
    simplr.controller.mAddBases(["customer"]);
    simplr.controller.mAddCommands({customer_login_create: {route: ["customer", "login", "create"],callback: function(b) {
                site.trigger.onPage({route: b});
                if (site.func.customerLoggedIn() && !site.isPaymentPage && 
                !site.isConfirmationPage)
                    window.location.href = urlConfig.root + "/pages/customer/#/customer/profile/";
                else {
                    var c = a(".js-rememberMe").is(":checked") || site.rememberMe;
                    site.func.toggleLoading(true);
                    jsDPZ.ajax.customerLogin({data: {loyaltyIsActive: dpz.loyalty.loyaltyIsActive() && dpz.loyalty.loyaltyIsOk(),u: b.parameters.email,p: b.parameters.password},success: function(d) {
                            a(".site-nav--homepage").removeClass("experienceD");
                            var f = jsDPZ.app.customer.getCustomer();
                            f.authorize(b.parameters.email, b.parameters.password);
                            jsDPZ.app.customer.setCustomerFromPower(d);
                            if (dpz.loyalty.loyaltyIsActive())
                                jsDPZ.app.order.getOrder().data.Details.Loyalty = a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Details.Loyalty);
                            site.sessionTools.save({async: false});
                            c && (site.storage.save("CID", f.data.CustomerID, 365), site.storage.save("customerFirstName", f.data.FirstName, 90));
                            f.fetchCreditCard({data: {rememberMe: c}});
                            if (killConfig.isActive("profileHomepage")) {
                                var e = a("html").attr("lang") || "en";
                                f.fetchOrderHistory({customerID: site.storage.load("CID"),
                                    loggedIn: site.func.customerLoggedIn(),loyaltyIsActive: dpz.loyalty.loyaltyIsActive() && dpz.loyalty.loyaltyIsOk(),lang: e,success: function(b) {
                                        if (b.customerOrders && b.customerOrders.length) {
                                            var c = b.easyOrder ? b.easyOrder : b.customerOrders[0];
                                            f.data.Session.EasyOrder = b.easyOrder;
                                            f.data.Session.hasEasyOrder = b.easyOrder ? true : false;
                                            f.data.Session.RecentOrderCount = b.customerOrders.length;
                                            site.sessionTools.save({async: false});
                                            site.isHomepage && (a(document).trigger("/customer/profile/login/", f), simplr.view.mRender({name: "order_history_view",
                                                data: {customerOrders: b},selector: "#orderHistory"}), simplr.view.mRender({name: "local_store_view",data: {customerOrder: c},selector: "#localStore"}), site.trigger.onPage({uri: "/home",group: "Home Page",subGroup: "Home Page",action: "view",base: urlConfig.root}))
                                        }
                                        site.func.updateMinorNavigation()
                                    }})
                            }
                            site.func.updateMinorNavigation();
                            site.func.genericOverlayToggle({show: false,viewName: "pizzaProfileLoginOverlay",UIBlockID: "overlayUIBlock3"});
                            jsDPZ.topic("customerLogin.success").publish(d);
                            a(document).trigger("customerLogin.success", 
                            d);
                            if (b.parameters.successCommand && b.parameters.successCommand !== "")
                                b.parameters.successCommand === dpz.loyalty.config.commands.enroll ? dpz.loyalty.enrollCustomer() : b.parameters.successCommand === dpz.loyalty.config.commands.optOut ? simplr.controller.mRouteAndExecute("/loyalty/opt-out/") : b.parameters.successCommand === dpz.loyalty.config.commands.redeem && simplr.controller.mRouteAndExecute("/product/S_PIZZA/builder/?code=12SCREEN&rewardsRedemption=1");
                            else if (dpz.loyalty.isReroute() && dpz.loyalty.loyaltyIsActive())
                                dpz.loyalty.loyaltyRedirect();
                            else if (b.parameters.savedClick)
                                b.parameters.stopOver ? (site.func.overlayToggle(true, "panUpsellOverlay", {}, {recoverable: true,panelNumber: site.data.ABData.profileSignIn.savedClick.panelNumber,panelName: site.data.ABData.profileSignIn.savedClick.panelName,defaultCoupon: "9193",upsellCoupon: "9194",couponPrice: "2.00"}), site.storage.remove("savedClick")) : (site.storage.remove("savedClick"), setTimeout(function() {
                                    window.location = b.parameters.savedClick
                                }, 500));
                            else if (b.parameters.semiLoggedIn && !b.parameters.paymentPage && 
                            !site.isConfirmationPage)
                                window.location = urlConfig.localRoot + "/pages/customer/#/customer/profile/";
                            else if (b.parameters.setEasyOrder)
                                site.func.overlayToggle(true, "nameEasyOrder", {}, {orderID: b.parameters.setEasyOrder}, {});
                            else if (b.parameters.removeEasyOrder)
                                site.func.overlayToggle(true, "removeEasyOrder", {}, {orderID: b.parameters.removeEasyOrder,easyOrderNickname: a(".js-removeEasyOrder").attr("data-easyordernickname")}, {});
                            else if (b.parameters.paymentPage) {
                                if (!b.parameters.semiLoggedIn)
                                    window.location.href = 
                                    urlConfig.localRoot + "/pages/order/payment.jsp"
                            } else
                                window.location.hash.indexOf("#/locations/") !== -1 ? simplr.controller.mRouteAndExecute("/locations/") : site.isPaymentPage ? simplr.controller.mRouteAndExecute("/checkout/") : window.location.hash.indexOf("#/customer/login/") !== -1 ? document.referrer === "http://www.dominos.com/" ? window.location = urlConfig.localRoot + "/index.jsp" : window.location.hash = "#/customer/profile/" : window.location.hash.indexOf("#/customer/profile/new") !== -1 ? window.location.hash = "#/customer/profile/" : 
                                window.location.hash.indexOf(dpz.loyalty.config.dashboardURL) !== -1 ? simplr.controller.mRouteAndExecute("/customer/rewards/") : window.location.hash.indexOf("/checkout/") !== -1 && dpz.loyalty.loyaltyIsActive() && dpz.loyalty.isEnrolled() && (dpz.loyalty.updateWidgets(), a(".js-loyalty-widgets-container").show())
                        },error: function(b) {
                            site.trigger.onEvent({breadcrumb: ["Customer", "Login Error", b.status + " - " + b.statusText]});
                            site.isPaymentPage && (a(".js-creditCardSelection").val() >= 0 && a("input[name='Credit_Card_Selection'][value='-1']").click(), 
                            a(".js-saveToProfile").is(":checked") && a(".js-saveToProfile").click(), a("#Easy_Order_Selection").is(":checked") && (a("#Easy_Order_Selection").prop("checked", false), a(".js-easyOrderLabel, #Easy_Order_Name").hide(), a("#Easy_Order_Name").val("")));
                            var b = b.responseText, c = "powerCustomer";
                            b.StatusItems && (b.StatusItems[0].Field == "NotAuthorized" ? c = "powerCustomer" : b.StatusItems[0].Code == "NotAuthorizedForMarket" && (c = "powerCustomerMarketEmailUsed"));
                            site.func.overlayToggle(true, "codeOverlay", {}, {code: c})
                        },complete: function() {
                            site.func.toggleLoading(false)
                        }})
                }
            }},
        customer_logout_view: {route: ["customer", "logout", "view"],callback: function() {
                jsDPZ.app.customer.setCustomer();
                jsDPZ.app.order.getOrder().data.Customer = a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Customer);
                if (dpz.loyalty.loyaltyIsActive())
                    jsDPZ.app.order.getOrder().data.Details.Loyalty = a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Details.Loyalty);
                jsDPZ.app.store.getStore().data = a.extend(true, {}, jsDPZ.config.dataModel.STORE);
                jsDPZ.ajax.customerLogout();
                jsDPZ.app.customer.getCustomer().deAuthorize();
                site.sessionTools.save({async: false});
                site.storage.remove("CID");
                site.storage.remove("customerFirstName");
                site.func.toggleLoading(true);
                setTimeout(function() {
                    site.func.toggleLoading(false);
                    window.location.href = urlConfig.localRoot + "/index.jsp"
                }, 1E3);
                a(document).trigger("customerLogout")
            }},customer_guestcheckout_view: {route: ["customer", "guest-checkout", "view"],callback: function() {
                jsDPZ.ajax.customerLogout();
                jsDPZ.app.customer.getCustomer().deAuthorize();
                if (dpz.loyalty.loyaltyIsActive())
                    jsDPZ.app.order.getOrder().data.Details.Loyalty = 
                    a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Details.Loyalty);
                site.sessionTools.save({async: false});
                site.storage.remove("CID");
                site.func.toggleLoading(true);
                setTimeout(function() {
                    site.func.toggleLoading(false);
                    window.location.href = urlConfig.localRoot + "/pages/order/payment.jsp"
                }, 1E3)
            }},customer_semilogout_view: {route: ["customer", "semilogout", "view"],callback: function(b) {
                var c = b.parameters.doRedirect == "true";
                jsDPZ.app.customer.setCustomer();
                jsDPZ.app.order.getOrder().data.Customer = a.extend(true, {}, 
                jsDPZ.config.dataModel.ORDER.Customer);
                if (dpz.loyalty.loyaltyIsActive())
                    jsDPZ.app.order.getOrder().data.Details.Loyalty = a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Details.Loyalty);
                jsDPZ.app.customer.getCustomer().deAuthorize();
                site.sessionTools.save({async: false});
                site.func.toggleLoading(true);
                setTimeout(function() {
                    site.func.toggleLoading(false);
                    if (c)
                        window.location.href = urlConfig.localRoot + "/index.jsp"
                }, 1E3)
            }},customer_profile_create: {route: ["customer", "profile", "create"],callback: function(b) {
                var c = 
                b.parameters.SaveCreditCard === "true", d = b.parameters.RememberMe === "true", f = b.parameters.EmailOptIn === "true", e = b.parameters.LoyaltyEnrollment === "true", f = a.extend(true, {}, jsDPZ.app.customer.getCustomer().getCustomerForPower(), {FirstName: b.parameters.FirstName,LastName: b.parameters.LastName,Email: b.parameters.Email,Password: b.parameters.Password,Phone: b.parameters.Phone,Extension: b.parameters.Extension,EmailOptIn: f,AgreeToTermsOfUse: true,Age13OrOlder: true});
                e && a.extend(true, f.Loyalty, {Command: "ENROLL"});
                site.func.toggleLoading(true);
                jsDPZ.ajax.customerSave({data: f,success: function(g) {
                        jsDPZ.topic("customerLogin.success").publish(g);
                        jsDPZ.app.customer.getCustomer().authorize(b.parameters.Email, b.parameters.Password);
                        jsDPZ.app.customer.setCustomerFromPower(g);
                        if (dpz.loyalty.loyaltyIsActive())
                            jsDPZ.app.order.getOrder().data.Details.Loyalty = a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Details.Loyalty);
                        site.sessionTools.save({async: false});
                        site.func.updateMinorNavigation();
                        site.trigger.onEvent({uri: "/account/newprofile",
                            group: "Account",subGroup: "Registration Complete",title: "Created Profile from Payment Page"});
                        if (dpz.loyalty.loyaltyIsActive() && dpz.loyalty.loyaltyIsOk() && e) {
                            if (jsDPZ.app.customer.getCustomer().data.Loyalty)
                                if (jsDPZ.app.customer.getCustomer().data.Loyalty.Status === "Fail")
                                    jsDPZ.app.customer.getCustomer().data.Session.LoyaltyEnrollmentError = true, site.sessionTools.save();
                                else {
                                    var f = dpz.market.marketName;
                                    if (b.parameters.EmailOptIn === "true" && f === "UNITED_STATES") {
                                        var f = jsDPZ.app.order.getOrder().data, g = 
                                        a.extend(true, {}, g), j = jsDPZ.app.store.getStore().data;
                                        jsDPZ.ajax.emailOptInAndOut({data: {FirstName: g.FirstName,LastName: g.LastName,Email: g.Email,EmailOptIn: true,Street: f.Customer.Address.Street,City: f.Customer.Address.City,Region: f.Customer.Address.Region,PostalCode: f.Customer.Address.PostalCode,StoreID: j.StoreID},async: false})
                                    }
                                }
                            else
                                dpz.loyalty.updateLoyaltyStatus(false);
                            site.trigger.onEvent({uri: "Checkout/asGuest/ActivateLoyalty",group: "Checkout as Guest Activate Loyalty",subGroup: "Checkout",title: "as Guest Activate Loyalty"})
                        }
                        c || 
                        b.parameters.saveAndPlaceOrder ? (delete site.cardInfo, site.saveCard = true, jsDPZ.app.customer.getCustomer().data.Session.NewProfile = true, simplr.controller.mRouteAndExecute(site.func.buildURL({url: "#/customer/creditcard/create",parameters: {billingZip: b.parameters.billingZip,cardType: b.parameters.cardType,expirationMonth: b.parameters.expirationMonth,expirationYear: b.parameters.expirationYear,nameOnCard: b.parameters.nameOnCard,nickName: b.parameters.nickName,number: b.parameters.number,securityCode: b.parameters.securityCode,
                                isDefault: b.parameters.isDefault,saveAndPlaceOrder: b.parameters.saveAndPlaceOrder}}))) : dpz.loyalty.isReroute() ? (jsDPZ.app.customer.getCustomer().data.Session.loyaltyConfirmation = true, site.sessionTools.save(), dpz.loyalty.loyaltyRedirect()) : window.location.hash.indexOf("/customer/profile/new") !== -1 && !b.parameters.confirmationPage && simplr.view.mRender({name: "customer_profile_view",data: {create: true},selector: "#js-customerPage"});
                        if (b.parameters.paymentsPage || b.parameters.confirmationPage) {
                            a(".js-profileCreateToggle").toggle();
                            if (b.parameters.SaveEasyOrder == "true")
                                site.easyOrderObj = {easyOrder: b.parameters.SaveEasyOrder,easyOrderNickName: b.parameters.EasyOrderName};
                            if (d)
                                site.rememberMe = true;
                            if (b.parameters.isSaveCreditCard)
                                site.saveCard = true;
                            simplr.controller.mRouteAndExecute(site.func.buildURL({url: "#/customer/login/create",parameters: {email: b.parameters.Email,password: b.parameters.Password,paymentsPage: true}}))
                        }
                    },error: function(c) {
                        site.trigger.onEvent({breadcrumb: ["Customer", "Save Error", c.status + " - " + c.statusText]});
                        var c = c.responseText, d = "powerCustomerGenericError";
                        c.StatusItems && (c.StatusItems[0].Field == "EmailAlreadyUsed" ? d = "powerCustomerEmailUsed" : c.StatusItems[0].Field == "NotAuthorized" ? d = "powerCustomer" : c.StatusItems[0].Field == "EmailAlreadyUsedInOtherMarket" && (d = "powerCustomerMarketEmailUsed"), a("#Pizza_Profile_Selection").prop("checked", false));
                        b.parameters.saveAndPlaceOrder ? (jsDPZ.app.customer.getCustomer().data.Session.NewProfile = false, simplr.controller.mRouteAndExecute(site.func.buildURL({url: "#/order/place/new",
                            parameters: {}}))) : site.func.overlayToggle(true, "codeOverlay", {}, {code: d})
                    },complete: function() {
                        b.parameters.saveAndPlaceOrder || site.func.toggleLoading(false)
                    }})
            }},customer_reset_password_create: {route: ["customer", "reset-password", "create"],callback: function(a) {
                site.func.toggleLoading(true);
                jsDPZ.ajax.changePassword({data: {u: decodeURIComponent(a.parameters.email)},success: function() {
                        site.func.overlayToggle(true, "codeOverlay", {}, {code: "iForgotPasswordSuccess",label: a.parameters.email,abtestView: a.parameters.ABtestView,
                            success: true,title: "forms.reset_password"})
                    },error: function(a) {
                        site.trigger.onEvent({breadcrumb: ["Customer", "Forgot Password Error", a.status + " - " + a.statusText]});
                        site.func.powerCommunicationError()
                    },complete: function() {
                        site.func.toggleLoading(false)
                    }});
                site.func.genericOverlayToggle({show: false,viewName: "pizzaProfileLoginOverlay",UIBlockID: "overlayUIBlock3"})
            }}});
    simplr.controller.mAddCommands({customer_location_view: {route: ["customer", "location", "view"],callback: function(b) {
                if (site.func.customerLoggedIn()) {
                    var c = 
                    jsDPZ.app.customer.getCustomer().data.Addresses, b = parseInt(b.resources.location, 10);
                    b >= 0 && b < c.length && site.func.overlayToggle(true, "customer_location_view", {}, a.extend(true, {}, c[b], {id: b}))
                } else
                    window.location.href = urlConfig.root + "/pages/customer/#/customer/login/"
            }},customer_location_create: {route: ["customer", "location", "create"],callback: function(a) {
                if (site.func.customerLoggedIn()) {
                    var c = jsDPZ.obj.customer(jsDPZ.app.customer.getCustomer().getCustomerForPower()).data, a = a.parameters;
                    if (a.Latitude)
                        a.Coordinates = 
                        {Latitude: a.Latitude,Longitude: a.Longitude}, delete a.Latitude, delete a.Longitude;
                    a.IsDefault = a.IsDefault === "true" ? true : false;
                    c.Addresses.push(a);
                    site.func.saveAccountData({data: c,success: function() {
                            site.trigger.onEvent({group: "Account",subGroup: "Add Location Complete",title: "Account - Add Location Complete",uri: "/account/addlocationcomplete"});
                            window.location.hash.indexOf("/customer/profile/") !== -1 && simplr.view.mRender({name: "customer_profile_view",data: {update: true},selector: "#js-customerPage"})
                        }})
                } else
                    site.func.overlayToggle(true, 
                    "codeOverlay", {}, {code: "powerCustomerGenericError"})
            }},customer_location_update: {route: ["customer", "location", "update"],callback: function(a) {
                if (site.func.customerLoggedIn()) {
                    for (var c = jsDPZ.obj.customer(jsDPZ.app.customer.getCustomer().getCustomerForPower()), d = c.data.Addresses, f = -1, e = 0, g = d.length; e < g; e++)
                        if (jsDPZ.util.htmlEscape(d[e].Name) == a.resources.location || jsDPZ.util.htmlUnEscape(d[e].Name) == a.resources.location) {
                            f = e;
                            break
                        }
                    if (f >= 0 && f < d.length) {
                        if (a.parameters.IsDefault === true || a.parameters.IsDefault === 
                        "true") {
                            e = 0;
                            for (g = d.length; e < g; e++)
                                d[e].IsDefault = false;
                            d[f].IsDefault = true
                        } else
                            a.parameters.DeliveryInstructions && !a.parameters.Region ? d[f].DeliveryInstructions = a.parameters.DeliveryInstructions : (d[f].LocationName = a.parameters.LocationName, d[f].Street = a.parameters.Street, d[f].StreetName = a.parameters.StreetName, d[f].StreetNumber = a.parameters.StreetNumber, d[f].StreetRange = a.parameters.StreetRange, d[f].AddressLine2 = a.parameters.AddressLine2, d[f].AddressLine3 = a.parameters.AddressLine3, d[f].Neighborhood = 
                            a.parameters.Neighborhood, d[f].City = a.parameters.City, d[f].Region = a.parameters.Region, d[f].PostalCode = a.parameters.PostalCode, d[f].DeliveryInstructions = a.parameters.DeliveryInstructions, d[f].AddressType = a.parameters.Type, d[f].Name = a.parameters.Name, d[f].CampusID = a.parameters.CampusID, d[f].BuildingID = a.parameters.BuildingID);
                        var h = a.resources.location, j = d[f].Name;
                        site.func.saveAccountData({data: c.data,success: function() {
                                site.trigger.onEvent({group: "Account",subGroup: "Edit Location Complete",title: "Account - Edit Location Complete",
                                    uri: "/account/editlocationcomplete"});
                                var a = jsDPZ.app.customer.getCustomer();
                                if (a.data.Session.AddressSelection === h)
                                    a.data.Session.AddressSelection = j;
                                site.func.overlayToggle(false);
                                window.location.hash.indexOf("/customer/profile/") !== -1 ? simplr.view.mRender({name: "customer_profile_view",data: {update: true},selector: "#js-customerPage"}) : window.location.hash.indexOf("#/locations/search/") !== -1 && simplr.controller.mRouteAndExecute("/locations/")
                            }})
                    } else
                        site.func.overlayToggle(true, "codeOverlay", {}, {code: "powerCustomerGenericError"})
                } else
                    site.func.overlayToggle(true, 
                    "codeOverlay", {}, {code: "powerCustomerGenericError"})
            }},customer_location_delete: {route: ["customer", "location", "delete"],callback: function(a) {
                if (site.func.customerLoggedIn()) {
                    var c = jsDPZ.obj.customer(jsDPZ.app.customer.getCustomer().getCustomerForPower()).data, d = c.Addresses, a = parseInt(a.resources.location, 10);
                    a >= 0 && a < d.length ? (d.remove(a), site.func.saveAccountData({data: c,success: function() {
                            site.trigger.onEvent({group: "Account",subGroup: "Remove Location Complete",title: "Account - Remove Location Complete",
                                uri: "/account/removelocationcomplete"});
                            window.location.hash.indexOf("/customer/profile/") !== -1 && simplr.view.mRender({name: "customer_profile_view",data: {update: true},selector: "#js-customerPage"})
                        }})) : site.func.overlayToggle(true, "codeOverlay", {}, {code: "powerCustomerGenericError"})
                } else
                    site.func.overlayToggle(true, "codeOverlay", {}, {code: "powerCustomerGenericError"})
            }}});
    simplr.controller.mAddCommands({customer_card_view: {route: ["customer", "creditcard", "view"],callback: function(b) {
                if (site.func.customerLoggedIn()) {
                    var c = 
                    jsDPZ.app.customer.getCustomer().data.CreditCards, b = parseInt(b.resources.creditcard, 10);
                    b >= 0 && b < c.length && site.func.overlayToggle(true, "customer_creditcard_view", {}, a.extend(true, {}, c[b], {id: b}))
                } else
                    window.location.href = urlConfig.root + "/pages/customer/#/customer/login/"
            }},customer_card_create: {route: ["customer", "creditcard", "create"],callback: function(a) {
                if (site.func.customerLoggedIn()) {
                    var c;
                    a.parameters.saveAndPlaceOrder && (c = true, delete a.parameters.saveAndPlaceOrder);
                    site.func.toggleLoading(true);
                    jsDPZ.app.customer.getCustomer().saveCreditCard({data: a.parameters,success: function(a) {
                            site.trigger.onEvent({group: "Account",subGroup: "Add Card Complete",title: "Account - Add Card Complete",uri: "/account/addcardcomplete"});
                            window.location.hash.indexOf("/customer/profile/") !== -1 && simplr.view.mRender({name: "customer_profile_view",data: {update: true},selector: "#js-customerPage"});
                            if (c)
                                for (var b = 0, e = site.data.payments.length; b < e; b++)
                                    if (site.data.payments[b].Type == "CreditCard")
                                        site.data.payments[b].CardID = 
                                        a.id, delete site.data.payments[b].Number, delete site.data.payments[b].CardType, delete site.data.payments[b].Expiration, delete site.data.payments[b].SecurityCode, delete site.data.payments[b].PostalCode
                        },error: function(a) {
                            var a = a.responseText.error, b = "powerCustomerGenericError";
                            a.length && a[0].code == "CardOnFileLimitExceeded" && (b = "powerCustomerMaxCreditCards");
                            site.func.overlayToggle(true, "codeOverlay", {}, {code: b})
                        },complete: function() {
                            c ? simplr.controller.mRouteAndExecute(site.func.buildURL({url: "#/order/place/new",
                                parameters: {}})) : site.func.toggleLoading(false)
                        }})
                } else
                    site.func.overlayToggle(true, "codeOverlay", {}, {code: "powerCustomerGenericError"})
            }},customer_card_update: {route: ["customer", "creditcard", "update"],callback: function(a) {
                if (site.func.customerLoggedIn()) {
                    var c = jsDPZ.obj.customer(jsDPZ.app.customer.getCustomer().data).data.CreditCards, d = parseInt(a.resources.creditcard, 10);
                    d >= 0 && d < c.length ? (a.parameters.isDefault ? c[d].isDefault = true : (c[d].expirationMonth = a.parameters.expirationMonth, c[d].expirationYear = 
                    a.parameters.expirationYear, c[d].nickName = a.parameters.nickName), site.func.toggleLoading(true), jsDPZ.app.customer.getCustomer().updateCreditCard({data: c[d],success: function() {
                            site.trigger.onEvent({group: "Account",subGroup: "Edit Card Complete",title: "Account - Edit Card Complete",uri: "/account/editcardcomplete"});
                            site.func.overlayToggle(false);
                            window.location.hash.indexOf("/customer/profile/") !== -1 ? a.parameters.isDefault ? jsDPZ.app.customer.getCustomer().fetchCreditCard({complete: function() {
                                    simplr.view.mRender({name: "customer_profile_view",
                                        data: {update: true},selector: "#js-customerPage"})
                                }}) : simplr.view.mRender({name: "customer_profile_view",data: {update: true},selector: "#js-customerPage"}) : simplr.view.mRender({name: "customer_creditcardlist_view",data: {justSelectCard: true},selector: "#paymentCreditCardList"})
                        },complete: function() {
                            site.func.toggleLoading(false)
                        }})) : site.func.overlayToggle(true, "codeOverlay", {}, {code: "powerCustomerGenericError"})
                } else
                    site.func.overlayToggle(true, "codeOverlay", {}, {code: "powerCustomerGenericError"})
            }},customer_card_delete: {route: ["customer", 
                "creditcard", "delete"],callback: function(a) {
                if (site.func.customerLoggedIn()) {
                    var c = jsDPZ.app.customer.getCustomer().data.CreditCards, a = parseInt(a.resources.creditcard, 10);
                    a >= 0 && a < c.length ? (site.func.toggleLoading(true), jsDPZ.app.customer.getCustomer().deleteCreditCard({data: {id: c[a].id},success: function() {
                            site.trigger.onEvent({group: "Account",subGroup: "Remove Card Complete",title: "Account - Remove Card Complete",uri: "/account/removecardcomplete"});
                            window.location.hash.indexOf("/customer/profile/") !== 
                            -1 && simplr.view.mRender({name: "customer_profile_view",data: {update: true},selector: "#js-customerPage"})
                        },complete: function() {
                            site.func.toggleLoading(false)
                        }})) : site.func.overlayToggle(true, "codeOverlay", {}, {code: "powerCustomerGenericError"})
                } else
                    site.func.overlayToggle(true, "codeOverlay", {}, {code: "powerCustomerGenericError"})
            }}});
    simplr.controller.mAddBases(["market"]);
    simplr.controller.mAddCommands({market_language_update: {route: ["market", "language", "update"],callback: function(a) {
                a = a.resources && 
                a.resources.language ? a.resources.language : void 0;
                if (typeof a === "string" && a.length == 2)
                    dpz.market.activeLanguageCode = a, window.localStorage.dpz_active_language = dpz.market.activeLanguageCode, dpz.marketSetup.basicCacheSave(), window.location = urlConfig.root + "/"
            }}});
    simplr.controller.mAddBases(["loyalty", "rewards", "checkout"]);
    simplr.controller.mAddCommands({loyalty_enroll_stopover: {route: ["checkout", "info", "view"],callback: function() {
                simplr.view.mRender({name: "loyalty_checkout_signin",data: {},selector: "#js-pageFull"});
                site.func.updateMainNavigation({main: "checkout"})
            }},loyalty_activate_splash: {route: ["rewards", "activate", "view"],callback: function() {
                simplr.view.mRender({name: "loyalty_checkout_activate",data: {},selector: "#js-pageFull"});
                site.func.updateMainNavigation({main: "checkout"})
            }},loyalty_profile: {route: ["customer", "rewards", "view"],callback: function() {
                var b = jsDPZ.app.customer.getCustomer().data, c = function() {
                    dpz.loyalty.loyaltyIsActive() ? dpz.loyalty.isEnrolled() && dpz.loyalty.loyaltyIsOk() ? (jsDPZ.ajax.fetchLoyaltySummary(b.CustomerID).then(function(c) {
                        a.extend(true, 
                        b.Loyalty, c);
                        delete b.Loyalty.CustomerID;
                        site.sessionTools.save();
                        simplr.view.mRender({name: "loyalty_rewards_details",data: {},selector: "#js-customerPage"})
                    }, function() {
                        updateLoyaltyStatus(false);
                        simplr.view.mRender({name: "loyalty_enrollment_details",data: {},selector: "#js-customerPage"})
                    }), site.func.updateMainNavigation({main: "profile",sub: "loyalty"})) : (simplr.view.mRender({name: "loyalty_enrollment_details",data: {},selector: "#js-customerPage"}), site.func.customerLoggedIn() || site.func.customerSemiLoggedIn() ? 
                    site.func.updateMainNavigation({main: "profile",sub: "loyalty"}) : site.func.updateMainNavigation({main: "restricted"})) : (simplr.view.mRender({name: "page_not_found",data: {},selector: "#js-customerPage"}), site.func.updateMainNavigation({main: "restricted"}))
                };
                site.func.customerSemiLoggedIn() && b.CustomerID === "" && site.storage.load("CID") ? (site.func.toggleLoading(true), jsDPZ.ajax.customerLogin({data: {rememberMe: true,loyaltyIsActive: dpz.loyalty.loyaltyIsActive() && dpz.loyalty.loyaltyIsOk()},success: function(b) {
                        jsDPZ.app.customer.setCustomerFromPower(b);
                        if (dpz.loyalty.loyaltyIsActive())
                            jsDPZ.app.order.getOrder().data.Details.Loyalty = a.extend(true, {}, jsDPZ.config.dataModel.ORDER.Details.Loyalty);
                        jsDPZ.app.customer.getCustomer().fetchCreditCard({success: function() {
                                c();
                                site.func.updateMinorNavigation()
                            },complete: function() {
                                site.func.toggleLoading(false)
                            },data: {rememberMe: true}})
                    },error: function() {
                        site.func.powerCommunicationError()
                    }})) : c()
            }},loyalty_opt_out: {route: ["loyalty", "opt-out", "view"],callback: function() {
                site.trigger.onEvent({group: "Loyalty",
                    subGroup: "OptOut",title: "Loyalty Opt Out",uri: "/Loyalty/OptOut/"});
                site.func.overlayToggle(true, "loyaltyOptOut", {}, {})
            }}});
    simplr.view.mAddViews({x: "",codeOverlay: {html: function(b) {
                var c = a.extend({success: false,code: "",label: "",title: ""}, b), b = a.type(c.label) === "array" ? c.label : [c.label];
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "codeOverlay",tokens: {routeHeading: c.code === "eRoutingMessage" ? "blk" : "",couponHeading: c.code === "eRoutingCouponMessage" ? 
                                "blk" : "",defaultHeading: c.code !== "eRoutingCouponMessage" && c.code !== "eRoutingMessage" ? "" : "none",codeClass: c.success ? "informationText" : "errorText",message: dpz.template.translateError(c.code, b),title: c.title}}}})
            },callback: function(b, c) {
                var d = a.extend({recoverable: true}, c);
                site.trigger.onEvent({uri: "/error/" + c.code,title: "Error or Alert " + c.code,group: "Error",subGroup: c.code,eventType: "error"});
                d.recoverable ? (site.func.setupLayerCloseEvents({layerSelector: b}), a(".js-continueButton", b).click(function(b) {
                    b.preventDefault();
                    var c = a(this).attr("href");
                    site.func.toggleLoading(true);
                    setTimeout(function() {
                        site.func.toggleLoading(false);
                        site.func.overlayToggle(false);
                        window.location = c
                    }, 1500)
                }), c.abtestView && c.abtestView === "headerProfileABTestE" && a(".js-closeButton", b).click(function() {
                    a(".profileSignInExperienceE .js-backToSignIn").click()
                })) : a(".js-closeButton", b).remove()
            }},eRoutingCouponOverlay: {html: function(b) {
                var c = a.extend({success: false,code: "",label: ""}, b);
                a.type(c.label);
                c = jsDPZ.app.order.getOrder().data.Details.Coupons[0].Code;
                b = b.nationalMenu.Coupons[c];
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "eRoutingCouponOverlay",tokens: {couponInNationalMenu: b,couponImage: dpz.market.directory + "/images/img/coupons/thumbnails/" + (b && b.ImageCode ? b.ImageCode : "placeholder") + ".jpg",couponName: b && b.Name}}}})
            },callback: function(b, c) {
                a(".card__header--coupon-routing").parent(".card--overlay").addClass("card--overlay--eCouponRouting");
                site.func.stackAttack(b);
                a.extend({recoverable: true}, 
                c);
                site.trigger.onEvent({uri: "/error/" + c.code,title: "Error or Alert " + c.code,group: "Error",subGroup: c.code,eventType: "error"});
                a(".js-continueButton", b).click(function(a) {
                    a.preventDefault();
                    site.trigger.onEvent({group: "Coupons",subGroup: "Entry \u2013 Find Location",title: "Coupon Entry \u2013 Find Location",uri: "/coupons/entry/findLocation"});
                    site.func.overlayToggle(false, "eRoutingCouponOverlay", {}, {})
                });
                a(".js-closeButton", b).click(function(a) {
                    a.preventDefault();
                    site.trigger.onEvent({group: "Coupons",
                        subGroup: "Entry \u2013 X to Close",title: "Coupon Entry \u2013 X to Close",uri: "/coupons/entry/XtoClose"});
                    site.func.overlayToggle(false, "eRoutingCouponOverlay", {}, {})
                })
            }},bubbleCodeOverlay: {html: function(b) {
                b = a.extend({success: false,code: "",label: ""}, b);
                return simplr.layout.mAssembleLayout({component: "bubbleCodeOverlay",tokens: {codeClass: b.success ? "informationText" : "errorText",message: dpz.template.translateError(b.code, b.label)}})
            },callback: function(b) {
                var c = a(b).text().split(" ").length / 5 * 1E3;
                clearTimeout(site.data.bubbleOverlayTimeout);
                site.data.bubbleOverlayTimeout = setTimeout(function() {
                    site.func.bubbleOverlayToggle(false)
                }, c);
                a(".js-closeButton", b).click(function(a) {
                    a.preventDefault();
                    clearTimeout(site.data.bubbleOverlayTimeout);
                    site.func.bubbleOverlayToggle(false)
                })
            }},contentOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "contentOverlay",tokens: {klass: a.klass}}}})
            },callback: function(b, c) {
                if (simplr.util.mEmpty(c.url)) {
                    if (!simplr.util.mEmpty(c.template)) {
                        var d = 
                        simplr.layout.mAssembleLayout({component: c.template,tokens: {}});
                        a(".js-content", b).html(d)
                    }
                } else
                    a.ajax({url: c.url,data: {type: "layer"},success: function(c) {
                            a(".js-content", b).html(c)
                        }});
                site.func.setupLayerCloseEvents({layerSelector: b})
            }},visualPizzaBubbleOverlay: {html: function(b) {
                b = a.extend({feeds: "",size: ""}, b);
                return simplr.layout.mAssembleLayout({component: "visualPizzaOverlay",tokens: {feeds: b.feeds,size: b.size}})
            },callback: function(b) {
                b = a(b).text().split(" ").length / 2 * 1E3;
                clearTimeout(site.data.bubbleOverlayTimeout);
                site.data.bubbleOverlayTimeout = setTimeout(function() {
                    site.func.visualPizzaBubbleOverlayToggle(false)
                }, b)
            }},mainLogo: {html: function() {
                return simplr.layout.mAssembleLayout({component: "logo",tokens: {logo_link: urlConfig.root + "/",logo_image: site.isHomepage ? "img-logo-home.png" : "img-logo-sub.png"}})
            },callback: function() {
            }},mobileLogo: {html: function() {
                return simplr.layout.mAssembleLayout({component: "mobileLogo",tokens: {logo_link: urlConfig.root + "/",logo_image: site.isHomepage ? "img-logo-home.png" : "img-logo-sub.png"}})
            },
            callback: function() {
            }},mainFooter: {html: function() {
                var b = a.Deferred();
                require(["dpz.config"], function(a) {
                    var d = a.getMarketProperty("footer"), f = a.getMarketProperty("socialLinks");
                    dpz.tnt.delayDoDefault(function(e) {
                        if (e && e.testClass === "navTest")
                            jsDPZ.app.customer.getCustomer().data.Session.navTest = e, site.sessionTools.save();
                        if (jsDPZ.app.customer.getCustomer().data.Session.navTest && !site.func.isHandheld() && (jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "b" || jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === 
                        "d" || jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "f"))
                            d = a.getMarketProperty("footerAB"), site.data.ABData.FooterLoaded = true;
                        e = simplr.layout.mAssembleLayout({component: "footer",tokens: {footerLinks: d.footerLinks,footerLegal: {component: "footerLegal",tokens: {}},socialLinks: {component: "socialLinks",tokens: f},promoLinks: {component: "promoLinks",tokens: {}}}});
                        b.resolve(e)
                    }, "Dominos-Global")
                });
                return b
            },callback: function(b) {
                !site.isHomepage && dpz.market.activeLanguageCode === "es" && 
                site.data.ABData.FooterLoaded && a(".site-footer li a").addClass("footer-ab");
                if (jsDPZ.app.customer.getCustomer().data.Session.navTest && !site.func.isHandheld() && (jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "b" || jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "d" || jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "f"))
                    a(".js-toggleLang", b).on("click", function() {
                        site.trigger.onEvent({title: dpz.market.activeLanguageName + 
                            " footer",uri: "/footer/" + dpz.market.activeLanguageName.toLowerCase(),group: "Footer Buttons",subgroup: dpz.market.activeLanguageName})
                    }), site.isConfirmationPage && a(".footer--lang-toggle-container").remove();
                a(".js-international").on("click", function(a) {
                    a.preventDefault();
                    site.func.toggleLoading(true);
                    jsDPZ.ajax.globalGateway({success: function(a) {
                            a && a.length ? site.func.overlayToggle(true, "globalGatewayOverlay", {}, a) : site.func.powerCommunicationError()
                        },error: site.func.powerCommunicationError,complete: function() {
                            site.func.toggleLoading(false)
                        }})
                })
            }},
        mainNavigation: {html: function(b) {
                var c = a.Deferred(), d = b.main || "", f = b.isContentPage;
                require(["dpz.config"], function(a) {
                    var b = f ? a.getMarketProperty("contentPages") || {} : false, h = f && b && b.pages ? b.pages[d].mainNavigation : a.getNavigation(d) || {}, j = "";
                    dpz.tnt.delayDoDefault(function(a) {
                        if (a && a.testClass === "navTest")
                            jsDPZ.app.customer.getCustomer().data.Session.navTest = a, site.sessionTools.save();
                        jsDPZ.app.customer.getCustomer().data.Session.navTest && !site.func.isHandheld() && (jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === 
                        "b" || jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "e" ? h = f && b && b.pages ? b.pages[d].rmEspagnol : dpz.market.marketConfig[d] ? dpz.config.killConfigStrip(dpz.config.getMarketProperty(d).rmEspagnol) : {} : jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "c" ? h = f && b && b.pages ? b.pages[d].rmGiftCards : dpz.market.marketConfig[d] ? dpz.config.killConfigStrip(dpz.config.getMarketProperty(d).rmGiftCards) : {} : jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === 
                        "d" ? h = f && b && b.pages ? b.pages[d].rmEspagnolAndGiftCards : dpz.market.marketConfig[d] ? dpz.config.killConfigStrip(dpz.config.getMarketProperty(d).rmEspagnolAndGiftCards) : {} : jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "f" && (h = f && b && b.pages ? b.pages[d].rmEspagnolAndGiftCardsAddGroupOrdering : dpz.market.marketConfig[d] ? dpz.config.killConfigStrip(dpz.config.getMarketProperty(d).rmEspagnolAndGiftCardsAddGroupOrdering) : {}));
                        h.length && (j = simplr.layout.mAssembleLayout({component: "siteMainNavigation",
                            tokens: {mainNavigation: h}}));
                        c.resolve(j)
                    }, "Dominos-Global")
                });
                return c
            },callback: function(b, c) {
                simplr.view.mRender({name: "mainLogo",selector: ".js-mainLogo"});
                simplr.view.mRender({name: "mobileLogo",selector: ".js-mobileLogo"});
                (function() {
                    a("header[role='banner'] .site-nav__main a").add("header[role='banner'] .logo").on("click", function(b) {
                        var b = a(b.target).text() != "" ? a(b.target).text() : a(b.target).attr("alt"), c = "/header/" + b.toLowerCase().replace(/ /g, "_").replace(/\./g, "");
                        site.trigger.onEvent({title: "Header " + 
                            b,uri: c,group: "Header Buttons",subGroup: b})
                    });
                    a(".js-responsiveBtnWt").on("click", function() {
                        site.trigger.onEvent({title: a(this).text() + " Button",uri: "/buttons/" + a(this).text().toLowerCase().replace(" ", "_"),group: "Home Page Buttons",subgroup: a(this).text()})
                    });
                    simplr.view.mRender({name: "customerResponsiveLogin",data: {message: site.isPaymentPage ? "payment.or_create_one_below" : ""},selector: ".nav-mini--sign-in"})
                })();
                window.location.href.match("/(.*/pages/content.*)|(/pages/customer)/") !== null && site.func.notifyCartUpdate();
                var d = !jsDPZ.util.empty(jsDPZ.app.store.getStore().data.StoreID);
                window.location.hash.indexOf("#/locations/") != -1 && !d ? (a("#js-mainSiteNavigation").find("a").not(".navigation-home").addClass("hidden"), a("#js-mainSiteNavigation a").removeClass("active").filter(".navigation-home").addClass("active")) : (a("#js-mainSiteNavigation").find("a").not(".navigation-home").removeClass("hidden"), a("#js-mainSiteNavigation a").removeClass("active").filter(".navigation-" + c.main).addClass("active"));
                a("a.navigation-" + 
                c.sub, b).addClass("active")
            }},headerProfile: {html: function(b) {
                var c = a.Deferred();
                !jsDPZ.util.empty(b.FirstName) || site.storage.load("customerFirstName");
                dpz.tnt.delayDoDefault(function(a) {
                    if (a && a.testClass === "navTest")
                        jsDPZ.app.customer.getCustomer().data.Session.navTest = a, site.sessionTools.save();
                    a = jsDPZ.app.customer.getCustomer().data.Session.navTest && !site.func.isHandheld() ? jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "e" ? true : false : false;
                    a = simplr.layout.mAssembleLayout({component: "headerProfile",
                        tokens: {firstName: b.FirstName,email: b.Email,isPaymentPage: site.isPaymentPage,isConfirmationPage: site.isConfirmationPage,navTest: a,esActive: dpz.market.activeLanguageCode === "es" ? true : false,enActive: dpz.market.activeLanguageCode === "en" ? true : false}});
                    c.resolve(a)
                }, "Dominos-Global");
                return c
            },callback: function(b) {
                jsDPZ.app.customer.getCustomer().data.Session.navTest && !site.func.isHandheld() && jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === "e" && (a(".js-toggleLang", b).on("click", 
                function() {
                    site.trigger.onEvent({title: dpz.market.activeLanguageName + " Toggle",uri: "/footer/toggle",group: "Language Toggle",subgroup: dpz.market.activeLanguageName})
                }), site.isConfirmationPage && a(".js-toggleLangAB", b).remove());
                if (site.func.customerLoggedIn() || site.func.customerSemiLoggedIn())
                    a(".js-changeLoginState").toggle(), a.each(a("header.is-anon"), function() {
                        a(this).removeClass("is-anon").addClass("is-profiled")
                    });
                a(".js-sign-in--pop-up").on("click", ".js-close-button", function() {
                    a(".js-sign-in--pop-up").fadeOut("slow");
                    site.trigger.onEvent({group: "Account",subGroup: "Sign In Overlay",title: "Sign In Overlay \u2013 X to Close",uri: "/account/signin"})
                });
                a(".js-sign-in--pop-up").on("click", ".js-login--pop-up", function(b) {
                    b.preventDefault();
                    a(".js-sign-in--pop-up").hide();
                    site.func.doLoginRedirectAndShowPopup(b, {trigger: {group: "Account",subGroup: "Sign In Overlay",title: "Sign In Overlay \u2013 Sign In",uri: "/account/signin"}})
                });
                jsDPZ.app.customer.getCustomer().data.Session.navTest && !site.func.isHandheld() && jsDPZ.app.customer.getCustomer().data.Session.navTest.settings.experience === 
                "e" && a(".js-sign-in--pop-up").css("right", "29%");
                a(".js-userName").on("click", function(b) {
                    b.preventDefault();
                    site.trigger.onEvent({group: "Account",subGroup: "Profile",title: "Account - Profile",uri: "/account/profile"});
                    site.func.customerSemiLoggedIn() ? site.func.showLoginPopup({semiLoggedIn: true}) : window.location = a(this).attr("href")
                });
                a(".js-notUser", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Sign Out",title: "Account - Sign Out",uri: "/account/signout"})
                });
                a(".js-login").on("click", 
                function(a) {
                    a.preventDefault();
                    site.func.doLoginRedirectAndShowPopup(a, {})
                });
                a(".js-createProfile", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Create Profile",title: "Account - Create Profile",uri: "/account/createprofile"})
                })
            }},progressBar: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "progressBar",tokens: {experience: a.experience,renderSlimVersion: a.renderSlimVersion}})
            },sessionUtil: {setSession: function(a) {
                    if (a == "contentPage") {
                        if (jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--current"] == 
                        "progress-bar__tile--pay" || jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--current"] == "progress-bar__tile--track")
                            jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--current"] = "progress-bar__tile--build", site.sessionTools.save()
                    } else
                        jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--current"] = a, jsDPZ.app.customer.getCustomer().data.Session[a] = "visited", site.sessionTools.save()
                },deleteSession: function(a) {
                    jsDPZ.app.customer.getCustomer().data.Session[a] = 
                    null;
                    site.sessionTools.save()
                },purgeSession: function() {
                    jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--find"] = null;
                    jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--build"] = null;
                    jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--pay"] = null;
                    jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--track"] = null;
                    jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--current"] = null;
                    site.sessionTools.save()
                }},updateSessionState: function(a) {
                a = 
                window.location.href;
                jsDPZ.app.store.getStore().data.StoreID == "" && jsDPZ.app.customer.getCustomer().data.Session.StoreID == "" ? (this.sessionUtil.purgeSession(), this.sessionUtil.setSession("progress-bar__tile--find")) : a.match("/order/??.*#/locations") !== null ? this.sessionUtil.setSession("progress-bar__tile--find") : window.location.href.match("/order/??.*#/(section|checkout)") !== null || a.indexOf("/order/menu") > -1 ? this.sessionUtil.setSession("progress-bar__tile--build") : a.indexOf("/order/payment") > -1 ? this.sessionUtil.setSession("progress-bar__tile--pay") : 
                a.indexOf("/order/confirmation") > -1 ? this.sessionUtil.setSession("progress-bar__tile--track") : this.sessionUtil.setSession("contentPage")
            },selectorTemplate: function(b) {
                this.selector = a("." + b);
                this.isActive = function() {
                    return jsDPZ.app.customer.getCustomer().data.Session[b] === "visited"
                };
                this.isCurrent = function() {
                    return b === jsDPZ.app.customer.getCustomer().data.Session["progress-bar__tile--current"]
                }
            },updateBarMarkup: function() {
                this.updateSessionState();
                var b = {find: new this.selectorTemplate("progress-bar__tile--find"),
                    build: new this.selectorTemplate("progress-bar__tile--build"),pay: new this.selectorTemplate("progress-bar__tile--pay"),track: new this.selectorTemplate("progress-bar__tile--track")}, c;
                for (c in b) {
                    var d = b[c];
                    d.isActive() && (d.isCurrent() ? (d.selector.addClass("progress-bar__tile--current"), d.selector.removeClass("progress-bar__tile--active"), d.selector.parent().prevAll("hr.progress-bar__line").addClass("progress-bar__tile--active"), c == "track" && d.selector.prevAll("hr.progress-bar__line").addClass("progress-bar__tile--active")) : 
                    (d.selector.parent().prevAll("hr.progress-bar__line").addClass("progress-bar__tile--active"), d.selector.addClass("progress-bar__tile--active"), d.selector.removeClass("progress-bar__tile--current")), d.selector.children("a").attr("href", d.selector.children("a").attr("data-link")), d.selector.parent("a").attr("href", d.selector.parent().attr("data-link")))
                }
                b.track.isCurrent() && (a(".progress-bar__tile--pay a").removeAttr("href"), this.sessionUtil.deleteSession("progress-bar__tile--pay"), this.sessionUtil.deleteSession("progress-bar__tile--track"))
            },
            callback: function() {
                this.updateBarMarkup();
                a(".progress-bar__container").animate({opacity: "show"}, 1E3)
            }},headerProfileABTEST: {html: function(a) {
                var c = !jsDPZ.util.empty(a.FirstName) ? a.FirstName : site.storage.load("customerFirstName"), d = !jsDPZ.util.empty(site.data.ABData.profileSignIn) && !site.func.customerLoggedIn() && site.data.ABData.profileSignIn.layoutComponent !== "control" ? "headerProfile" + site.data.ABData.profileSignIn.layoutComponent : "headerProfile";
                return simplr.layout.mAssembleLayout({component: d,
                    tokens: {firstName: c,email: a.Email}})
            },callback: function(b, c) {
                a(".js-userName").on("click", function(b) {
                    b.preventDefault();
                    site.trigger.onEvent({group: "Account",subGroup: "Profile",title: "Account - Profile",uri: "/account/profile"});
                    site.func.customerSemiLoggedIn() ? site.func.showLoginPopup({semiLoggedIn: true}) : window.location = a(this).attr("href")
                });
                a(".js-notUser", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Sign Out",title: "Account - Sign Out",uri: "/account/signout"})
                });
                a(".js-login").on("click", 
                function(a) {
                    a.preventDefault();
                    site.func.doLoginRedirectAndShowPopup(a, {})
                });
                a(".js-createProfile", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Create Profile",title: "Account - Create Profile",uri: "/account/createprofile"})
                });
                var d = {el: a("form", b),inputs: {Email: a(".js-email", b),Password: a(".js-password", b)},settings: {loginView: true},init: function() {
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields();
                        site.func.customerSemiLoggedIn() ? a(".js-anonymous", b).remove() : 
                        a(".js-semiLoggedIn", b).remove();
                        c.paymentPage ? a(".js-signout", b).remove() : a(".js-payment", b).remove();
                        this.inputs.Email.val() && this.inputs.Password.is(":visible") ? this.inputs.Password.focus() : this.inputs.Email.focus()
                    },validation: {rules: {Email: {email: true,required: function() {
                                    return !site.func.customerSemiLoggedIn() || !d.settings.loginView
                                },persist: true},Password: {required: function() {
                                    return d.settings.loginView
                                }},Remember_Me: {showOptional: function() {
                                    return d.settings.loginView
                                }}},submitHandler: function(a) {
                            var b = 
                            "";
                            if (site.data.ABData.profileSignIn && site.data.ABData.profileSignIn.experience)
                                b = site.data.ABData.profileSignIn.experience;
                            a = simplr.form.mGetValues(a);
                            simplr.controller.mRouteAndExecute(site.func.buildURL({url: d.settings.loginView ? "#/customer/login/create" : "#/customer/reset-password/create",parameters: {ABtestView: "headerProfileABTest" + b,email: a.Email,password: a.Password,semiLoggedIn: c.semiLoggedIn,creditCardCheckout: c.creditCardCheckout,setEasyOrder: c.setEasyOrder,removeEasyOrder: c.removeEasyOrder,
                                    paymentPage: c.paymentPage}}));
                            site.func.overlayToggle(false)
                        }}};
                d.init();
                var f = function() {
                    a(".js-toggleLogin", b).on("click", function(c) {
                        c.preventDefault();
                        a(".js-formActions", b).children().toggle();
                        d.settings.loginView = !d.settings.loginView;
                        d.el.renderFields();
                        a(".js-message", b).toggle(d.settings.loginView);
                        d.inputs.Email.val() && d.inputs.Password.is(":visible") ? d.inputs.Password.focus() : d.inputs.Email.focus()
                    })
                };
                a(".js-loginSubmit", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Sign In Submit",
                        title: "Account - Sign In Submit",uri: "/account/signinsubmit"})
                });
                a(".js-resetPassword", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Reset Password",title: "Account - Reset Password",uri: "/account/resetpassword"})
                });
                a(".js-createProfile", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Create Profile",title: "Account - Create Profile",uri: "/account/createprofile"})
                });
                a(".js-signout", b).on("click", function() {
                    simplr.controller.mRouteAndExecute("/customer/logout/")
                });
                a(".js-payment", b).on("click", function() {
                    simplr.controller.mRouteAndExecute("/customer/guest-checkout/")
                });
                a(".js-rememberMeLegal").on("click", function(b) {
                    b.preventDefault();
                    a(".js-rememberMeLegalText").toggle()
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",layerSelector: b,callback: function() {
                        c.paymentPage && (a("input[name='Payment_Type'][value='Credit']").is(":checked") && a(".js-creditCardSelection").val() >= 0 && a("input[name='Credit_Card_Selection'][value='-1']").click(), a("#Easy_Order_Selection").is(":checked") && 
                        (a("#Easy_Order_Selection").prop("checked", false), a(".js-easyOrderLabel, #Easy_Order_Name").hide(), a("#Easy_Order_Name").val("")))
                    }});
                var e = site.data.ABData.profileSignIn.experience, g = {B: function() {
                    },C: function() {
                        f();
                        a(document).on("click", ".is-anon .qa-Cl_order, .is-anon .qa-Cl_Coupons, .is-anon .block0 .media--tout a, .is-anon #asideMain .media--tout a", function(b) {
                            if (!site.func.customerLoggedIn() && !site.func.customerSemiLoggedIn()) {
                                var c = a(this);
                                b.preventDefault();
                                site.func.doLoginRedirectAndShowPopup(b, 
                                {});
                                site.data.ABData.profileSignIn.savedClick = {url: c.attr("href"),panelNumber: c.data("wt-panelnumber"),panelName: c.data("wt-panelname")};
                                site.storage.save("savedClick", site.data.ABData.profileSignIn.savedClick.url)
                            }
                        })
                    },D: function() {
                        f();
                        a(".site-nav--homepage").addClass("experienceD");
                        var b = function(a) {
                            simplr.cookie.mSet({name: "hasSeenSignInBanner",value: a,domain: "." + document.domain})
                        }, c = simplr.cookie.mGet({name: "hasSeenSignInBanner"});
                        !c || c === "" ? setTimeout(function() {
                            var c = window.location.hostname;
                            a(".experienceDfallback").hide();
                            a(".profileSignInExperienceD").slideDown();
                            c.indexOf("www") > -1 && b("hasSeenBanner")
                        }, 1E3) : b("");
                        a(".profileSignInExperienceD .js-closeButton").click(function() {
                            a(".profileSignInExperienceD").slideUp("fast");
                            a(".experienceDfallback").fadeIn("fast");
                            site.trigger.onEvent({uri: "/account/signin",title: "Profile Sign In Test D Banner - X to Close",group: "Account",subGroup: "Sign In Test D"})
                        });
                        var d = function() {
                            a(".profileSignInExperienceD").slideUp("fast");
                            a(".experienceDfallback").fadeIn("fast")
                        }, 
                        e = setTimeout(d, 6E3);
                        a("#headerProfileContainer").on("mouseover", ".profileSignInExperienceD", function() {
                            clearTimeout(e)
                        });
                        a("#headerProfileContainer").on("mouseout", ".profileSignInExperienceD", function() {
                            e = setTimeout(d, 2E3)
                        })
                    },E: function() {
                        site.func.setupTemplatePopups(b, {klass: "abHeaderE"});
                        var c = a.browser.msie && a.browser.version.split(".")[0] <= 9;
                        (function() {
                            c && a("input[placeholder]").each(function() {
                                a(this).val(a(this).attr("placeholder")).focus(function() {
                                    a(this).val() == a(this).attr("placeholder") && 
                                    a(this).val("")
                                }).blur(function() {
                                    a(this).val() == "" && a(this).val(a(this).attr("placeholder"))
                                })
                            })
                        })();
                        var e = function() {
                            var b = a(".js-backToSignIn, .js-resetPassword, .rememberMeContainer");
                            if (a("input[type='password']").attr("disabled") === "disabled") {
                                var d = c ? "Password" : "";
                                a("input[type='password']").attr("disabled", false).val(d)
                            } else
                                a("input[type='password']").attr("disabled", "disabled").val("");
                            a(".js-rememberMeLegalText").css("display") === "block" && a(".js-rememberMeLegalText").css("display", "none");
                            a(b).each(function() {
                                a(this).css("visibility") === "hidden" ? a(this).css("visibility", "visible") : a(this).css("visibility", "hidden")
                            })
                        };
                        a(".profileSignInExperienceE #Password").on("keyup", function() {
                            a(".forgotPassContainer").slideDown()
                        });
                        a(".js-toggleLogin").on("click", function() {
                            a(".signInContainer").children().toggle();
                            e();
                            d.settings.loginView = !d.settings.loginView
                        })
                    }};
                if (g.hasOwnProperty(e) && !site.func.customerLoggedIn() && !site.func.customerSemiLoggedIn())
                    g[e]();
                site.isHomepage && (site.func.customerLoggedIn() || 
                site.func.customerSemiLoggedIn()) && site.func.updateMinorNavigation()
            }},main_sub_navigation: {html: function(b) {
                var c = a.Deferred(), d = b.main || "", f = b.isContentPage;
                require(["dpz.config"], function(a) {
                    if ({checkout: true,coupons: true,drinks: true,entrees: true,groupOrdering: true,nationalMenu: true,locations: true,sides: true}[d])
                        dpz.tnt.delayDoDefault(function(b) {
                            var g = f ? a.getMarketProperty("contentPages") || {} : false;
                            if (b && b.testClass === "menuNavigation")
                                jsDPZ.app.customer.getCustomer().data.Session.globalMbox = b, 
                                site.sessionTools.save();
                            (b = jsDPZ.app.customer.getCustomer().data.Session.globalMbox) && (d = "abtest-4361-" + b.settings.experience + "-" + d);
                            g = f && g && g.pages ? g.pages[d].subNavigation : a.getSubNavigation(d) || {};
                            b = "";
                            g.length && (b = simplr.layout.mAssembleLayout({component: "subNavigation",tokens: {subNavigation: g}}));
                            c.resolve(b)
                        }, "Dominos-Global");
                    else {
                        var b = f ? a.getMarketProperty("contentPages") || {} : false, b = f && b && b.pages ? b.pages[d].subNavigation : a.getSubNavigation(d) || {}, h = "";
                        b.length && (h = simplr.layout.mAssembleLayout({component: "subNavigation",
                            tokens: {subNavigation: b}}));
                        c.resolve(h)
                    }
                });
                return c
            },callback: function(b, c) {
                a(".ex.navigation-Pizza").on("click", function() {
                    site.trigger.onEvent({group: "Entrees Menu",subGroup: "Sub Nav Pizza",title: "Entrees Menu Sub Nav Pizza",uri: "/en/pages/order/#/section/Food/category/Pizza/"})
                });
                a(".ex.navigation-Wings").on("click", function() {
                    site.trigger.onEvent({group: "Entrees Menu",subGroup: "Sub Nav Chicken",title: "Entrees Menu Sub Nav Chicken",uri: " /en/pages/order/#/section/Food/category/Chicken/"})
                });
                a(".ex.navigation-Sandwich").on("click", 
                function() {
                    site.trigger.onEvent({group: "Entrees Menu",subGroup: "Sub Nav Sandwiches",title: "Entrees Menu Sub Nav Sandwiches",uri: "/en/pages/order/#/section/Food/category/Sandwich/"})
                });
                a(".ex.navigation-Pasta").on("click", function() {
                    site.trigger.onEvent({group: "Entrees Menu",subGroup: "Sub Nav Pasta",title: "Entree Menu Sub Nav Pasta",uri: "/en/pages/order/#/section/Food/category/Pasta/"})
                });
                a(".ex.navigation-bread-and-sides").on("click", function() {
                    site.trigger.onEvent({group: "Entree Menu",subGroup: "Sub Nav Breads & Sides",
                        title: "Entrees Menu Sub Nav Breads & Sides",uri: " /en/pages/order/#/section/Food/category/BreadsAndSides"})
                });
                a(".ex.navigation-Desserts").on("click", function() {
                    site.trigger.onEvent({group: "Entree Menu",subGroup: "Sub Nav Desserts",title: "Entree Menu Sub Nav Desserts",uri: " /en/pages/order/#/section/Food/category/Desserts/"})
                });
                a(".ex.navigation-Drinks").on("click", function() {
                    site.trigger.onEvent({group: "Entree Menu",subGroup: "Sub Nav Drinks",title: "Entree Menu Sub Nav Drinks",uri: "/en/pages/order/#/section/Food/category/Drinks/"})
                });
                a(".ex.navigation-Sides").on("click", function() {
                    site.trigger.onEvent({group: "Entree Menu",subGroup: "Sub Nav Extras",title: "Entree Menu Sub Nav Extras",uri: "/en/pages/order/#/section/Food/category/Extras/"})
                });
                a(".ex-national-pizza").on("click", function() {
                    site.trigger.onEvent({group: "General Menu",subGroup: "Sub Nav Pizza",title: "Genearl Menu Sub Nav Pizza",uri: "/en/pages/order/#/section/Food/category/Pizza/"})
                });
                a(".ex-national-wings").on("click", function() {
                    site.trigger.onEvent({group: "General Menu",
                        subGroup: "Sub Nav Chicken",title: "General Menu Sub Nav Chicken",uri: " /en/pages/order/#/section/Food/category/Chicken/"})
                });
                a(".ex-national-sandwiches").on("click", function() {
                    site.trigger.onEvent({group: "General Menu",subGroup: "Sub Nav Sandwiches",title: "Genearl Menu Sub Nav Sandwiches",uri: "/en/pages/order/#/section/Food/category/Sandwich/"})
                });
                a(".ex-national-pasta").on("click", function() {
                    site.trigger.onEvent({group: "General Menu",subGroup: "Sub Nav Pasta",title: "General Menu Sub Nav Pasta",uri: "/en/pages/order/#/section/Food/category/Pasta/"})
                });
                a(".ex-national-breadsnsides").on("click", function() {
                    site.trigger.onEvent({group: "General Menu",subGroup: "Sub Nav Breads & Sides",title: "General Menu Sub Nav Breads & Sides",uri: " /en/pages/order/#/section/Food/category/BreadsAndSides"})
                });
                a(".ex-national-desserts").on("click", function() {
                    site.trigger.onEvent({group: "General Menu",subGroup: "Sub Nav Desserts",title: "General Menu Sub Nav Desserts",uri: " /en/pages/order/#/section/Food/category/Desserts/"})
                });
                a(".ex-national-drinks").on("click", function() {
                    site.trigger.onEvent({group: "General Menu",
                        subGroup: "Sub Nav Drinks",title: "General Menu Sub Nav Drinks",uri: "/en/pages/order/#/section/Food/category/Drinks/"})
                });
                a(".ex-national-extras").on("click", function() {
                    site.trigger.onEvent({group: "General Menu",subGroup: "Sub Nav Extras",title: "General Menu Sub Nav Extras",uri: "/en/pages/order/#/section/Food/category/Extras/"})
                });
                site.func.isGroupOrderingAvailable() ? a(".navigation-groupOrdering").parent().show() : a(".navigation-groupOrdering").parent().hide();
                if (site.data.navigation && site.data.navigation.states) {
                    var d = 
                    c.main == site.data.navigation.states.main.COUPONS ? "Coupons" : "Food";
                    a("li", b).filter("[id*='csn-']").each(function() {
                        var b = a(this).attr("id").split("-")[1];
                        c.main != "groupOrdering" && !site.catalogTools.categoryExists({section: d,category: b}) && (a(this).next(".divider").remove(), a(this).remove())
                    })
                }
                a("#js-mainSiteNavigation").find("a.navigation-coupons").attr("href", a(".js-couponCategories a", b).first().attr("href"));
                var f = !jsDPZ.util.empty(jsDPZ.app.store.getStore().data.StoreID);
                window.location.hash.indexOf("#/locations/") != 
                -1 && !f ? (a("#js-mainSiteNavigation").find("a").not(".navigation-home").addClass("hidden"), a("#js-mainSiteNavigation a").removeClass("active").filter(".navigation-home").addClass("active")) : (a("#js-mainSiteNavigation").find("a").not(".navigation-home").removeClass("hidden"), a("#js-mainSiteNavigation a").removeClass("active").filter(".navigation-" + c.main).addClass("active"));
                a("a.navigation-" + c.sub, b).addClass("active");
                a(".js-buildYourOwnPizza", b).click(function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({url: a(this).attr("href")}))
                });
                a("#js-subNavigationPage").off("click.WebTrends", "a");
                a("#js-subNavigationPage").on("click.WebTrends", "a", function() {
                    var b = a(".site-nav__main a.active").text();
                    site.trigger.onEvent({title: b + " Sub Nav " + a(this).text(),group: b,subGroup: "Sub Navigation"})
                });
                site.func.updateProgressBar(c)
            }},pizzaProfileLoginOverlay: {html: function() {
                var a = jsDPZ.app.customer.getCustomer().data;
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "pizzaProfileLoginOverlay",tokens: {firstName: a.FirstName,
                                email: a.Email,rememberMeLegalText: {component: "rememberMeLegalText",tokens: {}}}}}})
            },callback: function(b, c) {
                a(".js-sign-in--pop-up").hide();
                site.func.getCurrentBreakpoint() !== "handheld" && (a(".card--overlay").css("width", "550px"), a("#genericOverlay").css("top", "200px"));
                a(".js-loginKeepLoggedIn").click(function() {
                    a("input#Remember_Me").attr("checked", true)
                });
                a(".js-loginOnce").click(function() {
                    a("input#Remember_Me").attr("checked", false)
                });
                var d = {el: a("form", b),inputs: {Email: a(".js-email", b),Password: a(".js-password", 
                        b)},settings: {loginView: true},init: function() {
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields();
                        site.func.customerSemiLoggedIn() ? a(".js-anonymous", b).remove() : a(".js-semiLoggedIn", b).remove();
                        c.paymentPage ? a(".js-signout", b).remove() : a(".js-payment", b).remove();
                        this.inputs.Email.val() && this.inputs.Password.is(":visible") ? this.inputs.Password.focus() : this.inputs.Email.focus()
                    },validation: {rules: {Email: {email: true,required: function() {
                                    return !site.func.customerSemiLoggedIn() || !d.settings.loginView
                                },
                                persist: true},Password: {required: function() {
                                    return d.settings.loginView
                                }},Remember_Me: {showOptional: function() {
                                    return d.settings.loginView
                                }}},submitHandler: function(a) {
                            a = simplr.form.mGetValues(a);
                            simplr.controller.mRouteAndExecute(site.func.buildURL({url: d.settings.loginView ? "#/customer/login/create" : "#/customer/reset-password/create",parameters: {email: a.Email,password: a.Password,semiLoggedIn: c.semiLoggedIn,creditCardCheckout: c.creditCardCheckout,setEasyOrder: c.setEasyOrder,removeEasyOrder: c.removeEasyOrder,
                                    paymentPage: c.paymentPage,successCommand: c.successCommand ? c.successCommand : ""}}));
                            site.func.overlayToggle(false)
                        }}};
                d.init();
                a(".js-toggleLogin", b).on("click", function(c) {
                    c.preventDefault();
                    a(".js-formActions", b).children().toggle();
                    d.settings.loginView = !d.settings.loginView;
                    d.el.renderFields();
                    a(".js-message", b).toggle(d.settings.loginView);
                    d.inputs.Email.val() && d.inputs.Password.is(":visible") ? d.inputs.Password.focus() : d.inputs.Email.focus()
                });
                a(".js-loginSubmit", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",
                        subGroup: "Sign In Submit",title: "Account - Sign In Submit",uri: "/account/signinsubmit"})
                });
                a(".js-resetPassword", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Reset Password",title: "Account - Reset Password",uri: "/account/resetpassword"})
                });
                a(".js-createProfile", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Create Profile",title: "Account - Create Profile",uri: "/account/createprofile"})
                });
                a(".js-signout", b).on("click", function() {
                    simplr.controller.mRouteAndExecute("/customer/logout/")
                });
                a(".js-payment", b).on("click", function() {
                    jsDPZ.app.customer.getCustomer().data.Session.OrderModified = null;
                    site.sessionTools.save();
                    simplr.controller.mRouteAndExecute("/customer/guest-checkout/")
                });
                a(".js-rememberMeLegal").on("click", function(b) {
                    b.preventDefault();
                    a(".js-rememberMeLegalText").toggle()
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",layerSelector: b,callback: function() {
                        c.paymentPage && (a("input[name='Payment_Type'][value='Credit']").is(":checked") && a(".js-creditCardSelection").val() >= 
                        0 && a("input[name='Credit_Card_Selection'][value='-1']").click(), a("#Easy_Order_Selection").is(":checked") && (a("#Easy_Order_Selection").prop("checked", false), a(".js-easyOrderLabel, #Easy_Order_Name").hide(), a("#Easy_Order_Name").val("")))
                    }})
            }},pizzaProfileLoginOverlayC: {html: function() {
                var a = jsDPZ.app.customer.getCustomer().data;
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "pizzaProfileLoginOverlayC",tokens: {firstName: a.FirstName,email: a.Email}}}})
            },
            callback: function(b, c) {
                a(".overlayContentFrame").css("width", "480px");
                a("#genericOverlay").css("top", "200px");
                var d = {el: a("form", b),inputs: {Email: a(".js-email", b),Password: a(".js-password", b)},settings: {loginView: true},init: function() {
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields();
                        site.func.customerSemiLoggedIn() ? a(".js-anonymous", b).remove() : a(".js-semiLoggedIn", b).remove();
                        c.paymentPage ? a(".js-signout", b).remove() : a(".js-payment", b).remove();
                        this.inputs.Email.val() && this.inputs.Password.is(":visible") ? 
                        this.inputs.Password.focus() : this.inputs.Email.focus()
                    },validation: {rules: {Email: {email: true,required: function() {
                                    return !site.func.customerSemiLoggedIn() || !d.settings.loginView
                                },persist: true},Password: {required: function() {
                                    return d.settings.loginView
                                }},Remember_Me: {showOptional: function() {
                                    return d.settings.loginView
                                }}},submitHandler: function(a) {
                            var b = simplr.form.mGetValues(a), a = d.settings.loginView ? "#/customer/login/create" : "#/customer/reset-password/create", b = {email: b.Email,password: b.Password,semiLoggedIn: c.semiLoggedIn,
                                creditCardCheckout: c.creditCardCheckout,setEasyOrder: c.setEasyOrder,removeEasyOrder: c.removeEasyOrder,paymentPage: c.paymentPage};
                            if (site.data.ABData.profileSignIn.savedClick)
                                b.savedClick = site.data.ABData.profileSignIn.savedClick.url;
                            if (site.data.ABData.profileSignIn.upsellStopover)
                                b.stopOver = site.data.ABData.profileSignIn.upsellStopover;
                            simplr.controller.mRouteAndExecute(site.func.buildURL({url: a,parameters: b}));
                            site.func.overlayToggle(false)
                        }}};
                d.init();
                a(".js-toggleLogin", b).on("click", function(c) {
                    c.preventDefault();
                    a(".js-formActions", b).children().toggle();
                    d.settings.loginView = !d.settings.loginView;
                    d.el.renderFields();
                    a(".js-message", b).toggle(d.settings.loginView);
                    d.inputs.Email.val() && d.inputs.Password.is(":visible") ? d.inputs.Password.focus() : d.inputs.Email.focus()
                });
                a(".js-loginSubmit", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Sign In Submit",title: "Account - Sign In Submit",uri: "/account/signinsubmit"})
                });
                a(".js-resetPassword", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",
                        subGroup: "Reset Password",title: "Account - Reset Password",uri: "/account/resetpassword"});
                    a("#pizzaProfileLoginOverlay .loginError").hide()
                });
                a(".js-email, .js-password", b).on("focus", function() {
                    a("#pizzaProfileLoginOverlay .loginError").fadeOut()
                });
                a(".js-password, .js-email", b).on("keyup", function() {
                    a("#pizzaProfileLoginOverlay .loginError").fadeOut()
                });
                a(".js-createProfile", b).on("click", function() {
                    site.trigger.onEvent({group: "Account",subGroup: "Create Profile",title: "Account - Create Profile",
                        uri: "/account/createprofile"})
                });
                a(".js-signout", b).on("click", function() {
                    simplr.controller.mRouteAndExecute("/customer/logout/")
                });
                a(".js-payment", b).on("click", function() {
                    simplr.controller.mRouteAndExecute("/customer/guest-checkout/")
                });
                a(".js-rememberMeLegal").on("click", function(b) {
                    b.preventDefault();
                    a(".js-rememberMeLegalText").toggle()
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",layerSelector: b,callback: function() {
                        if (site.data.ABData.profileSignIn.upsellStopover)
                            site.func.overlayToggle(true, 
                            "panUpsellOverlay", {}, {recoverable: true,panelNumber: site.data.ABData.profileSignIn.savedClick.panelNumber,panelName: site.data.ABData.profileSignIn.savedClick.panelName,defaultCoupon: "9193",upsellCoupon: "9194",couponPrice: "2.00"}), site.storage.remove("savedClick");
                        else if (site.storage.remove("savedClick"), site.data.ABData.profileSignIn.savedClick && site.data.ABData.profileSignIn.savedClick.url)
                            window.location.href = site.data.ABData.profileSignIn.savedClick.url
                    }});
                a(".js-guestOrder").click(function() {
                    site.trigger.onEvent({group: "Account",
                        subGroup: "Order as Guest",title: "Profile Sign In ABTest C - Order as Guest",uri: "/account/signinsubmit"});
                    site.data.ABData.profileSignIn.upsellStopover ? (site.func.overlayToggle(true, "panUpsellOverlay", {}, {recoverable: true,panelNumber: site.data.ABData.profileSignIn.savedClick.panelNumber,panelName: site.data.ABData.profileSignIn.savedClick.panelName,defaultCoupon: "9193",upsellCoupon: "9194",couponPrice: "2.00"}), site.storage.remove("savedClick")) : site.data.ABData.profileSignIn && site.data.ABData.profileSignIn.savedClick && 
                    site.data.ABData.profileSignIn.savedClick.url ? (site.storage.remove("savedClick"), window.location = site.data.ABData.profileSignIn.savedClick.url) : window.location.href = urlConfig.localRoot + "/pages/order/"
                })
            }},pizzaProfileCreateOverlay: {html: function() {
                var a = jsDPZ.app.order.getOrder().data.Customer;
                Handlebars.registerPartial({contentPageTerms: dpz.template.getJST("contentPageTerms")});
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "customerCreateProfile",
                            tokens: {showLoyalty: dpz.loyalty.loyaltyIsActive() && dpz.loyalty.canEnroll(),profileFields: {component: "customerProfileOverlayFields",tokens: {showLoyalty: dpz.loyalty.canEnroll(),loyaltyTermsBody: {component: "loyaltyTermsBody",tokens: {}},firstName: a.FirstName,lastName: a.LastName,email: a.Email,phone: a.Phone,extension: a.Extension}}}}}})
            },callback: function(b, c) {
                site.func.getCurrentBreakpoint() !== "handheld" && a(".card--overlay").css("width", "480px");
                var d = {};
                c.data.saveCreditCard ? (d.billingZip = a("#Billing_Postal_Code").val(), 
                d.cardType = a("#Credit_Card_Type").val(), d.expirationMonth = a("#Expiration_Month").val(), d.expirationYear = a("#Expiration_Year").val(), d.number = a("#Credit_Card_Number").val(), d.securityCode = a("#Credit_Card_Security_Code").val(), a(".js-profileSaveCreditCard").show()) : a(".js-profileSaveCreditCard").hide();
                a("#Email_Opt_In").is(":checked") ? a("#Profile_Email_Opt_In").prop("checked", true) : a("#Profile_Email_Opt_In").prop("checked", false);
                a("#Agree_To_Terms_Of_Use").is(":checked") ? a("#Profile_Agree_To_Terms_Of_Use").prop("checked", 
                true) : a("#Profile_Agree_To_Terms_Of_Use").prop("checked", false);
                ({el: a("form", b),init: function() {
                        if (killConfig.isMarketEnabled("masksEnabled")) {
                            var c = dpz.config.getMarketProperty("mask");
                            a(".js-phone", b).mask(c.phone.mask, c.phone.properties);
                            a(".js-extension", b).mask(c.extension.mask, c.extension.properties)
                        }
                        a(".js-emailOptIn", b).on("click", function() {
                            if (a(this).is(":checked"))
                                site.trigger.onEvent({group: "Account",subGroup: "Email Yes",title: "Account - Email Yes",uri: "/account/emailyes"});
                            else
                                site.trigger.onEvent({group: "Account",
                                    subGroup: "Email No",title: "Account - Email No",uri: "/account/emailno"})
                        }).prop("checked", true);
                        site.func.setupContentPopups(b);
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields()
                    },validation: {rules: {Profile_Email: {required: true,email: true},Profile_Confirm_Email: {required: true,equalToCI: function() {
                                    return a(".js-email", b).val()
                                }},Profile_Create_Password: {required: true,minlength: 8},Profile_Confirm_Password: {required: true,equalTo: "#Profile_Create_Password"},Profile_Callback_Phone: {phone: true,
                                required: true},Profile_Remember_Me: {showOptional: true},Profile_Save_Credit_Card_Name: {showOptional: true},Profile_Save_Easy_Order_Name: {showOptional: true},Profile_Enroll_Loyalty: {showOptional: true}},submitHandler: function(b) {
                            b = simplr.form.mGetValues(b);
                            a.extend(b, c.data);
                            simplr.controller.mRouteAndExecute(site.func.buildURL({url: "#/customer/profile/create",parameters: {FirstName: b.FirstName,LastName: b.LastName,Email: b.Profile_Email,Phone: b.Phone.replace(/[^0-9]/g, ""),Extension: b.Extension.replace(/[^0-9]/g, 
                                    ""),Password: b.Profile_Create_Password,EmailOptIn: b.EmailOptIn,AgreeToTermsOfUse: b.AgreeToTermsOfUse,Age13OrOlder: b.AgreeToTermsOfUse,SaveEasyOrder: a("#Profile_Save_Easy_Order").is(":checked"),EasyOrderName: a("#Profile_Save_Easy_Order").is(":checked") ? a("#Profile_Save_Easy_Order_Name").val() : "",SaveCreditCard: a("#Profile_Save_Credit_Card").is(":checked"),nickName: a("#Profile_Save_Credit_Card_Name").val(),RememberMe: a("#Profile_Remember_Me").is(":checked"),billingZip: d.billingZip,cardType: d.cardType,
                                    expirationMonth: d.expirationMonth,expirationYear: d.expirationYear,number: d.number,securityCode: d.securityCode,isDefault: true,paymentsPage: true,LoyaltyEnrollment: a(".js-loyalty_profile_enroll").is(":checked")}}))
                        }}}).init();
                a(".js-easyOrderLegal").on("click", function(b) {
                    b.preventDefault();
                    a(".js-easyOrderLegalText").toggle()
                });
                a(".js-loyalty-details-toggler").on("click", function(b) {
                    b.preventDefault();
                    a(".js-loyalty-details").toggle()
                });
                a(".js-loyalty-terms-toggler").on("click", function(b) {
                    b.preventDefault();
                    a(".js-loyalty-terms-container").toggle()
                });
                a(".js-rememberMeLegal").on("click", function(b) {
                    b.preventDefault();
                    a(".js-rememberMeLegalText").toggle()
                });
                a(".js-termsOfUseOverlay").on("click", function(b) {
                    b.preventDefault();
                    a("#terms-of-use-container").toggle()
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",layerSelector: b,callback: function() {
                        site.isPaymentPage && a("#Pizza_Profile_Selection").prop("checked", false)
                    }})
            }},pizzaProfileCreateOverlayConfirmation: {html: function(a) {
                a = a.data;
                Handlebars.registerPartial({contentPageTerms: dpz.template.getJST("contentPageTerms")});
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "customerCreateProfileConfirmation",tokens: {profileFields: {component: "customerProfileOverlayFields",tokens: {showLoyalty: dpz.loyalty.canEnroll(),loyaltyTermsBody: {component: "loyaltyTermsBody",tokens: {}},firstName: a.FirstName,lastName: a.LastName,email: a.Email,phone: a.Phone,extension: a.Extension}}}}}})
            },callback: function(b, 
            c) {
                site.func.getCurrentBreakpoint() !== "handheld" && a(".card--overlay").css("width", "480px");
                a(".js-rememberMeLegal").on("click", function(b) {
                    b.preventDefault();
                    a(".js-rememberMeLegalText").toggle()
                });
                ({el: a("form", b),init: function() {
                        if (killConfig.isMarketEnabled("masksEnabled")) {
                            var c = dpz.config.getMarketProperty("mask");
                            a(".js-phone", b).mask(c.phone.mask, c.phone.properties);
                            a(".js-extension", b).mask(c.extension.mask, c.extension.properties)
                        }
                        a(".js-emailOptIn", b).on("click", function() {
                            if (a(this).is(":checked"))
                                site.trigger.onEvent({group: "Account",
                                    subGroup: "Email Yes",title: "Account - Email Yes",uri: "/account/emailyes"});
                            else
                                site.trigger.onEvent({group: "Account",subGroup: "Email No",title: "Account - Email No",uri: "/account/emailno"})
                        }).prop("checked", true);
                        site.func.setupContentPopups(b);
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields()
                    },validation: {rules: {Profile_Email: {required: true,email: true},Profile_Confirm_Email: {required: true,equalToCI: function() {
                                    return a(".js-email", b).val()
                                }},Profile_Create_Password: {required: true,
                                minlength: 8},Profile_Confirm_Password: {required: true,equalTo: "#Profile_Create_Password"},Profile_Callback_Phone: {phone: true,required: true},Profile_Remember_Me: {showOptional: true},Profile_Enroll_Loyalty: {showOptional: true}},submitHandler: function(b) {
                            b = simplr.form.mGetValues(b);
                            a.extend(b, c.data);
                            simplr.controller.mRouteAndExecute(site.func.buildURL({url: "#/customer/profile/create",parameters: {FirstName: b.FirstName,LastName: b.LastName,Email: b.Profile_Email,Phone: b.Phone.replace(/[^0-9]/g, ""),Extension: b.Extension.replace(/[^0-9]/g, 
                                    ""),Password: b.Profile_Create_Password,AgreeToTermsOfUse: true,Age13OrOlder: true,RememberMe: a("#Profile_Remember_Me").is(":checked"),confirmationPage: true,LoyaltyEnrollment: a(".js-loyalty_profile_enroll").is(":checked")}}))
                        }}}).init();
                a(".js-termsOfUseOverlay").on("click", function(b) {
                    b.preventDefault();
                    a("#terms-of-use-container").toggle()
                });
                dpz.loyalty.canEnroll() && (a(".js-loyalty-details-toggler").on("click", function(b) {
                    b.preventDefault();
                    a(".js-loyalty-details").toggle()
                }), a(".js-loyalty-terms-toggler").on("click", 
                function(b) {
                    b.preventDefault();
                    a(".js-loyalty-terms-container").toggle()
                }));
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",layerSelector: b,callback: function() {
                        site.isPaymentPage && a("#Pizza_Profile_Selection").prop("checked", false)
                    }})
            }},confirmOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "confirmOverlay",tokens: {message: dpz.template.translateError(a.code)}}}})
            },callback: function(b, c) {
                site.trigger.onEvent({uri: "/error/" + 
                    c.code,title: "Error or Alert " + c.code,group: "Error",subGroup: c.code,eventType: "error"});
                a(".js-continue", b).click(function(a) {
                    a.preventDefault();
                    site.func.overlayToggle(false);
                    c.continueFunc && c.continueFunc()
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",layerSelector: b,callback: function() {
                        c.cancelFunc && c.cancelFunc()
                    }})
            }},profileCreatedMsg: {html: function() {
                return simplr.layout.mAssembleLayout({component: "profileCreatedMsg",tokens: {firstName: jsDPZ.app.customer.getCustomer().data.FirstName}})
            },
            callback: function() {
            }},nameEasyOrder: {html: function() {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "nameEasyOrder",tokens: {}}}})
            },callback: function(b, c) {
                var d = jsDPZ.app.customer.getCustomer();
                a.browser.msie ? (a("#Easy_Order_Nickname").addClass("msie").val(a("#Easy_Order_Nickname").attr("placeholder")), a("#Easy_Order_Nickname").focus(function() {
                    a(this).val() == a(this).attr("placeholder") && a(this).val("")
                }).blur(function() {
                    a(this).val() == "" && a(this).val(a(this).attr("placeholder"))
                })) : 
                a("#Easy_Order_Nickname").focus();
                site.func.getCurrentBreakpoint() !== "handheld" && a(".card--overlay").css("width", "400px");
                a(".js-continue", b).on("click", function(f) {
                    f.preventDefault();
                    site.func.toggleLoading(true);
                    d.setEasyOrder({data: {orderID: c.orderID,easyOrderNickName: a("#Easy_Order_Nickname", b).val() == a("#Easy_Order_Nickname", b).attr("placeholder") ? "" : a("#Easy_Order_Nickname", b).val()},success: function() {
                            simplr.cookie.mExpire({name: "missingProducts"});
                            site.trigger.onEvent({uri: "/account/saveeasyorder",
                                title: "Account - Save Easy order",group: "Account",subGroup: "Save Easy Order"});
                            var b = a("html").attr("lang") || "en";
                            d.fetchOrderHistory({loggedIn: site.func.customerLoggedIn(),lang: b,loyaltyIsActive: dpz.loyalty.loyaltyIsActive() && dpz.loyalty.loyaltyIsOk(),success: function(b) {
                                    var c = b.customerOrders[0];
                                    a.each(b.customerOrders, function(a, b) {
                                        if (b.easyOrder)
                                            return c = b, false
                                    });
                                    simplr.view.mRender({name: "order_history_view",data: {customerOrders: b},selector: "#orderHistory"});
                                    simplr.view.mRender({name: "local_store_view",
                                        data: {customerOrder: c},selector: "#localStore"})
                                }})
                        },complete: function() {
                            site.func.toggleLoading(false)
                        }})
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton, .js-continue",layerSelector: b})
            }},removeEasyOrder: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "removeEasyOrder",tokens: {easyOrderNickname: a.easyOrderNickname}}}})
            },callback: function(b, c) {
                var d = jsDPZ.app.customer.getCustomer();
                site.func.getCurrentBreakpoint() !== 
                "handheld" && a(".card--overlay").css("width", "400px");
                a(".js-continue", b).on("click", function(b) {
                    b.preventDefault();
                    a(".js-easyOrder").hide();
                    site.func.toggleLoading(true);
                    d.removeEasyOrder({data: {orderID: c.orderID},success: function() {
                            site.trigger.onEvent({uri: "/account/removeeasyorder",title: "Account - Remove Easy order",group: "Account",subGroup: "Remove Easy Order"});
                            var b = a("html").attr("lang") || "en";
                            d.fetchOrderHistory({loggedIn: site.func.customerLoggedIn(),loyaltyIsActive: dpz.loyalty.loyaltyIsActive() && 
                                dpz.loyalty.loyaltyIsOk(),lang: b,success: function(b) {
                                    var c = b.customerOrders[0];
                                    a.each(b.customerOrders, function(a, b) {
                                        if (b.easyOrder)
                                            return c = b, false
                                    });
                                    simplr.view.mRender({name: "order_history_view",data: {customerOrders: b},selector: "#orderHistory"});
                                    simplr.view.mRender({name: "local_store_view",data: {customerOrder: c},selector: "#localStore"})
                                }})
                        },complete: function() {
                            site.func.toggleLoading(false)
                        }})
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton, .js-continue",layerSelector: b})
            }},
        glutenFreeDisclaimer: {html: function() {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "glutenFreeDisclaimer",tokens: {}}}})
            },callback: function(b, c) {
                a("a.js-closeButton").hide();
                a(".js-continue").on("click", function() {
                    simplr.controller.mRouteAndExecute(c.url);
                    site.func.overlayToggle(false)
                })
            }},pizzaCalculatorHelp: {html: function() {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "pizzaCalculatorHelp",
                            tokens: {}}}})
            },callback: function(a) {
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton, .js-continue",layerSelector: a})
            }},groupOrderingInfo: {html: function(b) {
                var c = [], d = [], f = 0;
                a.each(b.coupons, function(a, b) {
                    c.push(b.CouponTierThreshold)
                });
                for (var e = 0, g = c.length; e < g; e++)
                    if (e + 1 < g) {
                        var h = c[e], j = parseInt(c[e + 1]) - 1;
                        c[e] = h + "-" + j
                    } else
                        c[e] += "+";
                a.each(b.coupons, function(a, b) {
                    d.push({numberOfPizzas: c[f],percentOff: b.CouponTierPercentOff});
                    f++
                });
                return simplr.layout.mAssembleLayout({component: "genericOverlay",
                    tokens: {overlayContent: {component: "groupOrderingInfo",tokens: {couponInfo: {component: "couponInfo",tokens: d}}}}})
            },callback: function(b) {
                a(".card--overlay").css("width", "800px");
                site.func.stackAttack(b);
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton, .js-continue",layerSelector: b});
                a(".js-overlayFooter a").on("click", function(b) {
                    b.preventDefault();
                    site.func.overlayToggle(false);
                    window.location = a(this).attr("href")
                })
            }},globalGatewayOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",
                    tokens: {overlayContent: {component: "globalGatewayOverlay",tokens: {regions: a}}}})
            },callback: function(b) {
                a(b).find(".card").addClass("card--global-gateway");
                setTimeout(function() {
                    a("#overlayUIBlock1").addClass("overlay-ui-block--global-gateway")
                }, 1);
                for (var c = a("#js-globalGatewayMarketList").find(".js-globalGatewayTile"), d = 0, f = c.length; d < f; d += 2)
                    c.slice(d, d + 2).wrapAll('<div class="grid__cell--one-third grid__cell--handheld--one"></div>');
                a(".js-globalGatewayCountryList").each(function() {
                    var b = a(this), 
                    c = b.find(".js-globalGatewayListItem").length, d = Math.ceil(c / 2);
                    if (c > 5) {
                        var f = b.addClass("grid__cell--one-half").clone();
                        b.find("li").slice(d, c).remove();
                        f.find("li").slice(0, d).remove();
                        b.parent().append(f);
                        b.parents(".js-globalGatewayTile").addClass("grid grid--no-gutter")
                    }
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",layerSelector: b,callback: function() {
                        a("#overlayUIBlock1").removeClass("overlay-ui-block--global-gateway")
                    }});
                a(".js-marketLink").on("click", function(b) {
                    b.preventDefault();
                    a("#js-globalGatewayMarketList").hide();
                    a("#js-globalGatewayConfirmation, #js-globalGatewayBack").show();
                    a("#js-globalGatewayContinue").attr("href", a(this).attr("href"))
                });
                a("#js-globalGatewayBack").on("click", function(b) {
                    b.preventDefault();
                    a("#js-globalGatewayConfirmation, #js-globalGatewayBack").hide();
                    a("#js-globalGatewayMarketList").show()
                });
                a("#js-globalGatewayContinue").on("click", function() {
                    site.func.overlayToggle(false)
                })
            }},ipadSplash: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "ipadSplash",
                    tokens: {cardType: a && a.cardType ? a.cardType : "default",downloadMessage: a && a.downloadMessage ? a.downloadMessage : "DOWNLOAD THE APP",closeMessage: a && a.closeMessage ? a.closeMessage : "Continue to site",appUrl: "http://itunes.apple.com/us/app/dominos-pizza-usa/id436491861"}})
            },callback: function(b, c) {
                var d = a.extend({recoverable: true}, c);
                site.trigger.onEvent({uri: "/error/" + c.code,title: "Error or Alert " + c.code,group: "Error",subGroup: c.code,eventType: "error"});
                d.recoverable ? (site.func.setupLayerCloseEvents({layerSelector: b}), 
                a(".ipad-splash__btn", b).click(function(b) {
                    b.preventDefault();
                    if (c.triggers && c.triggers.downloadTrigger)
                        site.trigger.onEvent(c.triggers.downloadTrigger);
                    var d = a(this).parent().prop("href");
                    site.func.toggleLoading(true);
                    setTimeout(function() {
                        site.func.toggleLoading(false);
                        site.func.overlayToggle(false);
                        document.location = d
                    }, 1500)
                }), a(".ipad-splash__close", b).click(function(b) {
                    b.preventDefault();
                    if (c.triggers && c.triggers.noThanksTrigger)
                        site.trigger.onEvent(c.triggers.noThanksTrigger);
                    a(this).attr("href");
                    site.func.toggleLoading(true);
                    site.func.toggleLoading(false);
                    site.func.overlayToggle(false)
                }), a(".js-closeButton", b).click(function(b) {
                    b.preventDefault();
                    if (c.triggers && c.triggers.closeTrigger)
                        site.trigger.onEvent(c.triggers.closeTrigger);
                    a(this).attr("href");
                    site.func.toggleLoading(true);
                    site.func.toggleLoading(false);
                    site.func.overlayToggle(false)
                })) : a(".js-closeButton", b).remove()
            }},customerResponsiveLogin: {html: function(a) {
                var c = !(site.func.customerLoggedIn() || site.func.customerSemiLoggedIn()), 
                d = site.isConfirmationPage;
                return simplr.layout.mAssembleLayout({component: "customerResponsiveLogin",tokens: {message: a && a.message ? a.message : "",renderData: c && !d}})
            },callback: function() {
                a(".js-login--responsive").on("click", function(a) {
                    a.preventDefault();
                    site.func.doLoginRedirectAndShowPopup(a, {})
                })
            }},customerPasswordUpdated: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "customerPasswordResetConfirmation",tokens: {title: "customer.password_updated",
                                message: dpz.template.translateError(a.code ? a.code : "eGenericPointOfServiceError"),confirm: "customer.continue_to_sign_in",codeClass: a.success ? "informationText" : "errorText"}}}})
            },callback: function() {
                a(".js-closeButton").click(function(a) {
                    a.preventDefault();
                    site.func.overlayToggle(false);
                    site.func.toggleLoading(true);
                    window.location = urlConfig.localRoot + "/index.jsp"
                });
                a(".js-confirm").click(function(a) {
                    a.preventDefault();
                    site.func.overlayToggle(false);
                    site.func.toggleLoading(true);
                    site.func.doLoginRedirectAndShowPopup(a, 
                    {forceRedirect: true})
                })
            }},loyalty_checkout_activate: {html: function() {
                var a = dpz.loyalty.getEnrollmentBonusConfig(), c = dpz.loyalty.config.defaultBase;
                return simplr.layout.mAssembleLayout({component: "checkoutLoyaltyActivate",tokens: {showBonus: a.show,bonusPoints: a.bonusPoints,bonusTotalNeeds: a.bonusTotalNeeds,earningPoints: c.pointsPerOrder,totalNeeded: c.totalNeeded,loyaltyReward: dpz.template.translate(c.rewardString),rewardPoints: c.rewardPoints,loyaltyTermsBody: {component: "loyaltyTermsBody",tokens: {}}}})
            },
            callback: function() {
                site.func.showFull();
                a(".js-activateLoyalty").on("click", function(a) {
                    a.preventDefault();
                    site.func.customerLoggedIn() ? dpz.loyalty.enrollCustomer() : site.func.showLoginPopup({successCommand: dpz.loyalty.config.commands.enroll})
                });
                a(".legal-text-button").on("click", function(b) {
                    b.preventDefault();
                    a(".legal-dropdown").stop().slideToggle();
                    site.trigger.onEvent({uri: "Checkout/asProfiled/LoyaltyTaCClick",title: "Checkout as Profiled Loyalty TaC Click",group: "Checkout",subGroup: "as Profiled Loyalty TaC Click"})
                });
                site.trigger.onEvent({group: "Checkout",subGroup: "as Profiled Activate Loyalty",title: "Checkout as Profiled Activate Loyalty",uri: "/Checkout/asProfiled/ActivateLoyalty"});
                jsDPZ.app.customer.getCustomer().data.Session.LoyaltyEnrollmentError && (delete jsDPZ.app.customer.getCustomer().data.Session.LoyaltyEnrollmentError, site.sessionTools.save(), site.func.toggleLoading(false), site.func.overlayToggle(true, "codeOverlay", {}, {code: "eLoyaltyProfileCreationFailed"}))
            }},missingProductsOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "missingProductsOverlay",
                    tokens: {missingProductsText: {component: "missingProductsText",tokens: {}},allMissing: a.allMissing}})
            },callback: function(b, c) {
                a(".js-missing-product--confirm").on("click", function(a) {
                    a.preventDefault();
                    site.trigger.onEvent({uri: "/home/eoreorder/discountinuedproduct/accept",title: "Discontinued Product Accept",group: "Reorder",subGroup: "Discontinued Product Accept"});
                    site.func.overlayToggle(false, "missingProductsOverlay", {}, {})
                });
                a(".js-missing-product--close").on("click", function(a) {
                    a.preventDefault();
                    site.trigger.onEvent({uri: "/home/eoreorder/discountinuedproduct/XtoClose",title: "Discontinued Product X to Close",group: "Reorder",subGroup: "Discontinued Product X to Close"});
                    site.func.overlayToggle(false, "missingProductsOverlay", {}, {})
                });
                site.trigger.onEvent(a.extend({uri: "/error/discontinuedproduct/reorder",title: "Error or Alert Discontinued Product",group: "Error",subGroup: "Discontinued Product Reorder"}, c.triggers.load))
            }},loyalty_checkout_signin: {html: function() {
                var a = jsDPZ.app.customer.getCustomer().data, 
                c = dpz.loyalty.getEnrollmentBonusConfig(), d = dpz.loyalty.config.defaultBase;
                return simplr.layout.mAssembleLayout({component: "checkoutLoyaltyStopover",tokens: {loyaltyCanEnroll: dpz.loyalty.canEnroll(),firstName: a.FirstName,lastName: a.LastName,email: a.Email,phone: a.Phone,extension: a.Extension,showBonus: c.show,bonusPoints: c.bonusPoints,bonusTotalNeeds: c.bonusTotalNeeds,earningPoints: d.pointsPerOrder,totalNeeded: d.totalNeeded,rewardPoints: d.rewardPoints,loyaltyReward: dpz.template.translate(d.rewardString)}})
            },
            callback: function(b, c) {
                a(".js-loginKeepLoggedIn").click(function() {
                    a("input#Remember_Me").attr("checked", true)
                });
                a(".js-loginOnce").click(function() {
                    a("input#Remember_Me").attr("checked", false)
                });
                var d = {el: a("form#loyalty-stopover-signin", b),inputs: {Email: a(".js-email", b),Password: a(".js-password", b)},settings: {loginView: true},init: function() {
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields();
                        site.func.customerSemiLoggedIn() ? a(".js-anonymous", b).remove() : a(".js-semiLoggedIn", b).remove();
                        c.paymentPage ? a(".js-signout", b).remove() : a(".js-payment", b).remove();
                        this.inputs.Email.val() && this.inputs.Password.is(":visible") ? this.inputs.Password.focus() : this.inputs.Email.focus()
                    },validation: {rules: {Email: {email: true,required: function() {
                                    return !site.func.customerSemiLoggedIn() || !d.settings.loginView
                                },persist: true},Password: {required: function() {
                                    return d.settings.loginView
                                }},Remember_Me: {showOptional: function() {
                                    return d.settings.loginView
                                }}},submitHandler: function(a) {
                            a = simplr.form.mGetValues(a);
                            simplr.controller.mRouteAndExecute(site.func.buildURL({url: d.settings.loginView ? "#/customer/login/create" : "#/customer/reset-password/create",parameters: {email: a.Email,password: a.Password,semiLoggedIn: c.semiLoggedIn,creditCardCheckout: c.creditCardCheckout,setEasyOrder: c.setEasyOrder,removeEasyOrder: c.removeEasyOrder,paymentPage: c.paymentPage}}));
                            site.func.overlayToggle(false)
                        }}};
                d.init();
                a(".js-toggleLogin", b).on("click", function(c) {
                    c.preventDefault();
                    a(".js-formActions", b).children().toggle();
                    d.settings.loginView = 
                    !d.settings.loginView;
                    d.el.renderFields();
                    a(".js-message", b).toggle(d.settings.loginView);
                    d.inputs.Email.val() && d.inputs.Password.is(":visible") ? d.inputs.Password.focus() : d.inputs.Email.focus()
                });
                a(".js-signout", b).on("click", function() {
                    simplr.controller.mRouteAndExecute("/customer/logout/")
                });
                a(".js-payment", b).on("click", function() {
                    simplr.controller.mRouteAndExecute("/customer/guest-checkout/")
                });
                a(".js-rememberMeLegal").on("click", function(b) {
                    b.preventDefault();
                    a(".js-rememberMeLegalText").toggle();
                    site.trigger.onEvent({group: "Checkout",subGroup: "as Profiled Keep Me Signedin ShowInfo",title: "Checkout as Profiled Keep Me Signedin ShowInfo",uri: "/Checkout/asProfiled/KeepMeSignedIn/ShowInfo"})
                });
                a(".js-rememberMe").on("click", function() {
                    var b = a(".js-rememberMe").is(":checked") ? "Check" : "UnCheck";
                    site.trigger.onEvent({group: "Checkout",subGroup: "as Profiled Keep Me Signedin " + b,title: "Checkout as Profiled Keep Me Signedin " + b,uri: "/Checkout/asProfiled/KeepMeSignedIn/" + b})
                });
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",
                    layerSelector: b,callback: function() {
                        c.paymentPage && (a("input[name='Payment_Type'][value='Credit']").is(":checked") && a(".js-creditCardSelection").val() >= 0 && a("input[name='Credit_Card_Selection'][value='-1']").click(), a("#Easy_Order_Selection").is(":checked") && (a("#Easy_Order_Selection").prop("checked", false), a(".js-easyOrderLabel, #Easy_Order_Name").hide(), a("#Easy_Order_Name").val("")))
                    }});
                ({el: a("form#loyalty-order-as-guest", b),init: function() {
                        if (killConfig.isMarketEnabled("masksEnabled")) {
                            var c = 
                            dpz.config.getMarketProperty("mask");
                            a(".js-phone", b).mask(c.phone.mask, c.phone.properties);
                            a(".js-extension", b).mask(c.extension.mask, c.extension.properties)
                        }
                        a(".js-emailOptIn", b).on("click", function() {
                            if (a(this).is(":checked"))
                                site.trigger.onEvent({group: "Checkout",subGroup: "as Guest Email Optin Check",title: "Checkout as Guest Email Optin Check",uri: "/Checkout/asGuest/EmailOptinCheck"});
                            else
                                site.trigger.onEvent({group: "Checkout",subGroup: "as Guest Email Optin Uncheck",title: "Checkout as Guest Email Optin Uncheck",
                                    uri: "/Checkout/asGuest/EmailOptinUncheck"})
                        }).prop("checked", true);
                        site.func.setupContentPopups(b);
                        site.func.setupTemplatePopups(b);
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields()
                    },validation: {rules: {First_Name: {required: true},Last_Name: {required: true},Email: {required: true,email: true},Confirm_Email: {required: true,equalToCI: function() {
                                    return a(".js-guest-email", b).val()
                                }},Phone: {required: true,phone: true},Extension: {showOptional: true},Create_Password: {required: true,minlength: 8},
                            Confirm_Password: {required: true,equalTo: "#Create_Password"},Email_Opt_In: {showOptional: function() {
                                    return dpz.market.marketName === "UNITED_STATES" ? true : false
                                }},Agree_To_Terms_Of_Use: {required: true}},submitHandler: function(b) {
                            var c;
                            c = simplr.form.mGetValues(b);
                            var d = (b = dpz.loyalty.canEnroll() && a(".js-loyaltyOptIn").attr("checked") === "checked") ? "#/customer/profile/create" : urlConfig.localRoot + "/pages/order/payment.jsp";
                            c = {FirstName: c.First_Name,LastName: c.Last_Name,Email: c.Email,Phone: c.Phone.replace(/[^0-9]/g, 
                                ""),Extension: c.Extension.replace(/[^0-9]/g, ""),Password: c.Create_Password,EmailOptIn: c.Email_Opt_In,AgreeToTermsOfUse: c.Agree_To_Terms_Of_Use,Age13OrOlder: c.Agree_To_Terms_Of_Use};
                            b ? (c.LoyaltyEnrollment = true, b = site.func.buildURL({url: d,parameters: c}), simplr.controller.mRouteAndExecute(b)) : (a.extend(jsDPZ.app.customer.getCustomer().data, c), site.sessionTools.save(), window.location = d)
                        }}}).init();
                site.func.showFull();
                a(".js-loyaltyOptInContainer").show();
                a(".js-signIn.js-viewToggle").on("click", function(b) {
                    b.preventDefault();
                    site.trigger.onEvent({group: "Checkout",subGroup: "Profiled Select",title: "Checkout as Profiled Select",uri: "/Checkout/asProfiled/Select"});
                    a(".js-signIn.js-viewToggle").hide();
                    a(".grid__cell--loyalty-stopover--checkout-selection--first").removeClass("grid__cell--loyalty-stopover--checkout-selection--first");
                    a(".js-orderAsGuest-action-container").removeClass("grid__cell--loyalty-stopover--selected-action");
                    a(".js-signIn-action-container").addClass("grid__cell--loyalty-stopover--selected-action");
                    a(".js-orderAsGuest.js-viewToggle").show();
                    a(".js-orderAsGuest.js-toggledContent").is(":visible") ? a(".js-toggledContent").toggle() : a(".js-signIn.js-toggledContent").slideDown("fast");
                    a(".js-signIn #Email").focus()
                });
                a(".js-orderAsGuest.js-viewToggle").on("click", function(c) {
                    c.preventDefault();
                    site.trigger.onEvent({group: "Checkout",subGroup: "Guest Select",title: "Checkout Guest Select",uri: "/Checkout/Guest/Select"});
                    a(".grid__cell--loyalty-stopover--checkout-selection--first").removeClass("grid__cell--loyalty-stopover--checkout-selection--first");
                    a(".js-signIn-action-container").removeClass("grid__cell--loyalty-stopover--selected-action");
                    a(".js-orderAsGuest-action-container").addClass("grid__cell--loyalty-stopover--selected-action");
                    a(".js-orderAsGuest.js-viewToggle").hide();
                    a(".js-signIn.js-viewToggle").show();
                    a(".js-signIn.js-toggledContent").is(":visible") ? a(".js-toggledContent").toggle() : a(".js-orderAsGuest.js-toggledContent").slideDown("fast");
                    a(".js-orderAsGuest #First_Name").focus();
                    a(b).on("focus", ".js-phone", function() {
                        a(".js-arrow-box").css("display") === 
                        "none" && !a(".js-loyaltyOptIn").prop("checked") && (site.func.isHandheld() ? a(".js-arrow-box").slideDown("slow") : a(".js-arrow-box").toggle("slide"))
                    })
                });
                if (dpz.loyalty.canEnroll())
                    a(".js-loyaltyOptIn").on("change", function() {
                        a(".js-loyaltyProfileCreationFields").stop().slideToggle("fast");
                        a(".js-loyaltyOptIn").prop("checked") ? (a(".js-arrow-box").hide(), a(".js-orderAsGuest .btn").text(dpz.template.translate("forms.enroll_and_continue")), site.trigger.onEvent({group: "Checkout",subGroup: "as Guest Loyalty Enroll Check",
                            title: "Checkout as Guest Loyalty Enroll Check",uri: "/Checkout/asGuest/LoyaltyEnrollCheck"})) : (a(".js-arrow-box").show(), a(".js-orderAsGuest .btn").text(dpz.template.translate("forms.continue")), site.trigger.onEvent({group: "Checkout",subGroup: "as Guest Loyalty Enroll UnCheck",title: "Checkout as Guest Loyalty Enroll UnCheck",uri: "/Checkout/asGuest/LoyaltyEnrollUnCheck"}));
                        a(".js-termsOfUse").toggle()
                    });
                var f = jsDPZ.app.customer.getCustomer().data, e = jsDPZ.app.order.getOrder().data;
                f.FirstName !== "" && f.Email !== 
                "" && (a(".js-emailOptIn", b).prop("checked", e.Customer.EmailOptIn ? e.Customer.EmailOptIn : f.EmailOptIn), a(".grid__cell--loyalty-stopover--checkout-selection--first").removeClass("grid__cell--loyalty-stopover--checkout-selection--first"), a(".js-signIn-action-container").removeClass("grid__cell--loyalty-stopover--selected-action"), a(".js-orderAsGuest-action-container").addClass("grid__cell--loyalty-stopover--selected-action"), a(".js-orderAsGuest.js-viewToggle").hide(), a(".js-signIn.js-toggledContent").hide(), 
                a(".js-signIn.js-viewToggle").show(), a(".js-orderAsGuest.js-toggledContent").slideDown("fast"), dpz.loyalty.canEnroll() && setTimeout(function() {
                    a(".js-arrow-box").css("display") === "none" && !a(".js-loyaltyOptIn").prop("checked") && (site.func.isHandheld() ? a(".js-arrow-box").slideDown("slow") : a(".js-arrow-box").toggle("slide"))
                }, 1E3));
                a(".js-loyaltyTerms").on("click", function() {
                    site.trigger.onEvent({uri: "Checkout/asGuest/LoyaltyTaCClick",title: "Checkout as Guest Loyalty TaC Click",group: "Checkout",subGroup: "as Guest Loyalty TaC Click"})
                });
                site.trigger.onEvent({uri: "/Checkout/asProfiledGuest",title: "Checkout as Profiled or Guest",group: "Checkout",subGroup: "as Profiled or Guest"})
            }},loyalty_rewards_details: {html: function() {
                dpz.loyalty.getCustomerPoints();
                dpz.loyalty.getPointsRange();
                var a = moment(jsDPZ.app.customer.getCustomer().data.Loyalty.BasePointExpirationDate, "YYYY-MM-DD").format(dpz.market.marketConfig.dateFormat.DATE);
                return simplr.layout.mAssembleLayout({component: "loyaltyRewardsDetails",tokens: {dashboard: {component: "loyaltyDashboard",
                            tokens: {}},pendingPointsHistory: {component: "loyaltyHistoryTable",tokens: {showBalance: false,containerIdClass: "js-loyalty-pending-container",titleClass: "card__body--loyalty--title card__body--loyalty--title--pending",bodyIdClass: "js-loyalty-pending-body",title: "customer.loyalty_pending_activity_title",footerText: "customer.loyalty_pending_activity_footer",footerClass: "loyalty-history--pending"}},completedPointsHistory: {component: "loyaltyHistoryTable",tokens: {expirationDate: a,showBalance: true,containerIdClass: "js-loyalty-completed-container",
                                titleClass: "card__body--loyalty--title",bodyIdClass: "js-loyalty-completed-body",title: "customer.loyalty_completed_activity",footerText: "customer.loyalty_history_warning",footerClass: "loyalty-history--expiration"}},loyaltyProgramDetails: {component: "loyaltyProgramDetails",tokens: {faqs: {component: "loyaltyFaq",tokens: {customClass: "card__body--loyalty-details"}}}}}})
            },callback: function(b) {
                dpz.loyalty.updateWidgets({keepCoupons: false});
                site.func.setupTemplatePopups(b);
                a(".loyalty-rewards-toggler").on("click", 
                function(b) {
                    b.preventDefault();
                    a(".js-loyalty-rewards-toggle").toggle()
                });
                a(".loyalty-rewards-details--opt-out a").on("click", function(a) {
                    a.preventDefault();
                    site.func.customerLoggedIn() ? simplr.controller.mRouteAndExecute("/loyalty/opt-out/") : site.func.showLoginPopup({successCommand: dpz.loyalty.config.commands.optOut})
                });
                var c = function() {
                    var b = a(".js-loyalty-pending-body").children("tr.loyalty-history--transaction").length > 0, c = a(".js-loyalty-history-body").children("tr.loyalty-history--transaction").length > 
                    0;
                    b && a(".js-loyalty-pending-container").hide();
                    c && a(".js-loyalty-completed-container").hide();
                    a(".js-loyalty-history-error").show()
                };
                jsDPZ.app.customer.getCustomer().data.Session.Loyalty = a.extend({}, jsDPZ.app.customer.getCustomer().data.Session.Loyalty, {pageIndex: 0});
                site.sessionTools.save();
                var d = function() {
                    if (dpz.loyalty.loyaltyIsOk() && dpz.loyalty.isEnrolled()) {
                        site.func.toggleLoading(true, {}, {});
                        var b = jsDPZ.app.customer.getCustomer().data;
                        b.Session.Loyalty.pageIndex += 1;
                        site.sessionTools.save();
                        dpz.loyalty.getHistoryPoints({pageIndex: b.Session.Loyalty.pageIndex,successCallback: function(b) {
                                var c = b.pendingHistory.length > 0 || a(".js-js-loyalty-pending-body").children("tr.loyalty-history--transaction").length > 0, d = b.completedHistory.length > 0 || a(".js-loyalty-history-body").children("tr.loyalty-history--transaction").length > 0, f = "";
                                c && (a(".js-loyalty-pending-body").append(simplr.layout.mAssembleLayout({component: "loyaltyHistoryList",tokens: {historyComponent: b.pendingHistory}})), a(".js-loyalty-pending-container").show().css("visibility", 
                                "hidden"), f += ".js-loyalty-pending-container");
                                d && (a(".js-loyalty-completed-body").append(simplr.layout.mAssembleLayout({component: "loyaltyHistoryList",tokens: {historyComponent: b.completedHistory}})), a(".js-loyalty-completed-container").show().css("visibility", "hidden"), f += c ? ", .js-loyalty-completed-container" : ".js-loyalty-completed-container");
                                !d && !c && a(".js-loyalty-no-history").show();
                                a(".js-loyalty-history-error").hide();
                                a(".js-loyalty-history-container").addClass("has-history").slideDown(function() {
                                    a(f).hide().css("visibility", 
                                    "visible").fadeIn("slow")
                                })
                            },errorCallback: c})
                    } else
                        !dpz.loyalty.loyaltyIsOk() && dpz.loyalty.isEnrolled() && (c(), a(".js-loyalty-history-container").slideDown())
                };
                a(".loyalty-history").on("click", ".loyalty-history--transaction--toggler", function(b) {
                    b.preventDefault();
                    b = a(this).parents(".loyalty-history--transaction").next(".loyalty-history--transaction--details");
                    a(b).hasClass("none") ? (a(this).html("&#9650"), a(b).removeClass("none")) : (a(this).html("&#9660"), a(b).addClass("none"));
                    site.trigger.onEvent({group: "Acount",
                        subGroup: "Details Piece of the Pie Rewards Expand",title: "Account Details Piece of the Pie Rewards Expand",uri: "/Account/Details/PieceOfThePieRewardsExpand"})
                });
                a(".loyalty-history-toggler, .alerts__history").on("click.fetchHistory", function(b) {
                    b.preventDefault();
                    a(".alerts__history, .loyalty-history-toggler").unbind("click.fetchHistory");
                    d()
                });
                a(".loyalty-history-toggler").on("click", function(b) {
                    b.preventDefault();
                    a(".loyalty-history-toggle").toggle();
                    a(".js-loyalty-history-container.has-history").stop().slideToggle();
                    if (a(".js-loyalty-history-container").is(":visible"))
                        site.trigger.onEvent({group: "Loyalty",subGroup: "Details",title: "Loyalty Details",uri: "/Loyalty/Details"})
                });
                site.trigger.onEvent({group: "Account",subGroup: "Details Piece of the Pie Rewards",title: "Account Details Piece of the Pie Rewards",uri: "/account/details/PieceOfThePieRewards"});
                a(b).on("click", ".loyalty-faq--question", function(b) {
                    b.preventDefault();
                    b = a(this).parent().find(".loyalty-faq--answer");
                    b.css("display") === "none" ? a(this).find("span").html("&#9650") : 
                    a(this).find("span").html("&#9660");
                    b.toggle()
                })
            }},loyalty_enrollment_details: {html: function() {
                return simplr.layout.mAssembleLayout({component: "loyaltyEnrollmentDetails",tokens: {displayLoginDetails: !(site.func.customerLoggedIn() || site.func.customerSemiLoggedIn()),loyaltyProgramDetails: {component: "loyaltyProgramDetails",tokens: {faqs: {component: "loyaltyFaq",tokens: {customClass: "card__body--loyalty-details"}}}}}})
            },callback: function(b) {
                a(".js-login-rewards", b).on("click", function(a) {
                    a.preventDefault();
                    site.func.showLoginPopup({evt: a,trigger: {title: "Account - Loyalty Details Sign In",uri: "/locations/account/signin"}})
                });
                site.func.setupTemplatePopups(b);
                a(b).on("click", ".loyalty-faq--question", function(b) {
                    b.preventDefault();
                    b = a(this).parent().find(".loyalty-faq--answer");
                    b.css("display") === "none" ? a(this).find("span").html("&#9650") : a(this).find("span").html("&#9660");
                    b.toggle()
                })
            }},page_not_found: {html: function() {
                var b = a.Deferred();
                require(["dpz.template"], function() {
                    var a = simplr.layout.mAssembleLayout({component: "error404",
                        tokens: {}});
                    b.resolve(a)
                });
                return b
            }},loyaltyStoreParticipationOverlay: {html: function() {
                var a = dpz.loyalty.config.defaultBase;
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "loyaltyStoreParticipationOverlay",tokens: {earningPoints: a.pointsPerOrder,totalNeeded: a.totalNeeded,rewardPoints: a.rewardPoints,loyaltyReward: dpz.template.translate(a.rewardString)}}}})
            },callback: function(b) {
                site.trigger.onEvent({group: "Account",subGroup: "Loyalty Promo Prompt",
                    title: "Account Loyalty Promo Prompt",uri: "/account/loyalty/promoprompt"});
                site.func.getCurrentBreakpoint() !== "handheld" && (a(".card--overlay").css("width", "550px"), a("#genericOverlay").css("top", "200px"));
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton, .js-okayButton",layerSelector: b,callback: function() {
                        site.oloTools.config.pageOLODataReady();
                        site.oloTools.processQueues()
                    }});
                a(".js-closeButton, .js-okayButton").on("click", function(b) {
                    b.preventDefault();
                    if (a(this).hasClass("js-okayButton"))
                        site.trigger.onEvent({uri: "/Account/loyalty/promoprompt/Okay",
                            title: "Account Loyalty Promo Prompt Okay",group: "Account",subGroup: "Loyalty Promo Prompt Okay"});
                    else
                        site.trigger.onEvent({uri: "/Account/loyalty/promoprompt/Xout",title: "Account Loyalty Promo Prompt Xout",group: "Account",subGroup: "Loyalty Promo Prompt Xout"})
                })
            }},loyaltyOptOut: {html: function() {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "loyaltyOptOut",tokens: {}}}})
            },callback: function(b) {
                a(".js-sign-in--pop-up").hide();
                site.func.getCurrentBreakpoint() !== 
                "handheld" && a(".card--overlay").css("width", "550px");
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton, .js-continue",layerSelector: b});
                a(".js-loyaltyOptOut").on("click", function(b) {
                    b.preventDefault();
                    var d = a(this).attr("href"), f = a.extend(true, {}, jsDPZ.app.customer.getCustomer().getCustomerForPower());
                    f.Loyalty.Command = "OPTOUT";
                    site.func.saveAccountData({data: f,success: function(b) {
                            b.Loyalty.Status !== "Fail" ? (site.func.overlayToggle(false), window.location = d) : (a.extend(jsDPZ.app.customer.getCustomer().data.Loyalty, 
                            f.Loyalty), site.sessionTools.save(), site.func.overlayToggle(true, "codeOverlay", {}, {code: "eLoyaltyOptOutFailed"}))
                        },error: function() {
                            site.func.overlayToggle(true, "codeOverlay", {}, {code: "eLoyaltyOptOutFailed"})
                        }})
                })
            }},loyalty_widget_balance: {html: function() {
                var a = dpz.loyalty.getCustomerPoints(), c = dpz.loyalty.getPointsRange();
                return simplr.layout.mAssembleLayout({component: "loyaltyWidgetBalance",tokens: {pointsBase: c.BasePoints,pointsBalance: a.RemainderPoints,pointsPending: a.PendingPoints,pointsMessage: a.PendingPoints > 
                        0,defaultMessage: a.BalancePoints >= c.BasePoints && a.PendingPoints === 0,loyaltyIsOk: dpz.loyalty.loyaltyIsOk()}})
            },callback: function(b, c) {
                function d(b) {
                    var c = 0;
                    if (b != c)
                        var d = setInterval(function() {
                            c < b ? c += 6 : (clearTimeout(d), a(".js-pointsBalance").html(b));
                            c > b ? a(".js-pointsBalance").html(b) : a(".js-pointsBalance").html(c)
                        }, 100);
                    else
                        a(".js-pointsBalance").html(b)
                }
                function f() {
                    var b = j && k, c = m * 16;
                    a(".points__bar").animate({width: dpz.loyalty.getPercentage()}, {duration: c,complete: function() {
                            b ? setTimeout(e, n * 100) : 
                            (dpz.loyalty.getPizzaCount() > 0 || !dpz.loyalty.store.isParticipating()) && g()
                        }})
                }
                function e() {
                    a(".loyalty__widget__text--points-balance, .loyalty__widget__text--free-pizza").fadeOut("slow", function() {
                        a(".loyalty__widget__text--pizza-earned").addClass("bounce-in");
                        a(".loyalty__widget__star--rotation").fadeOut();
                        g();
                        jsDPZ.app.customer.getCustomer().data.Session.AnimateWidgets = false;
                        site.sessionTools.save();
                        setTimeout(function() {
                            a(".loyalty__widget__text--pizza-earned").fadeOut("fast", function() {
                                a(".loyalty__widget__text--points-balance, .loyalty__widget__text--free-pizza").fadeIn("fast")
                            })
                        }, 
                        2500)
                    });
                    a(".loyalty__widget__star").addClass("loyalty__widget__star--rotation")
                }
                function g() {
                    a(".loyalty--widget-container--redemption").slideDown("slow")
                }
                var h = dpz.loyalty.getCustomerPoints(), j = h.HasEarnedNewPizza, k = c.animate, l = h.BalancePoints, m = h.RemainderPoints > 0 ? h.RemainderPoints : dpz.loyalty.getPointsRange().BasePoints, n = site.func.isHandheld() ? 1.5 : 1;
                l > 0 ? a(".points__bar").show() : a(".points__bar").hide();
                dpz.loyalty.loyaltyIsOk() ? j && k ? (l = function() {
                    setTimeout(function() {
                        d(dpz.loyalty.getPointsRange().BasePoints);
                        f()
                    }, n * 500)
                }, site.func.isHandheld() ? site.func.doWhenVisible(b, l, true) : l()) : k ? (l = function() {
                    dpz.loyalty.getPizzaCount() > 0 && a(".loyalty__widget__text--free-pizza span.text--next").show();
                    d(h.RemainderPoints);
                    f()
                }, site.func.isHandheld() ? site.func.doWhenVisible(b, l, true) : l()) : (dpz.loyalty.getPizzaCount() > 0 && !j && (a(".js-pointsBalance").html(h.RemainderPoints), a(".loyalty--widget-container--redemption, .loyalty__widget__text--free-pizza span.text--next").show()), j && (a(".js-pointsBalance").html(dpz.loyalty.getPointsRange().BasePoints), 
                a(".points__bar").css("width", dpz.loyalty.getPercentage())), (j || !dpz.loyalty.store.isParticipating()) && a(".loyalty--widget-container--redemption").show()) : a(".loyalty--widget-container--redemption, .loyalty__widget__text--free-pizza span.text--next").show();
                k || a(".points__bar").animate({width: dpz.loyalty.getPercentage()}, 1E3)
            }},loyalty_widget_redemption: {html: function() {
                var a = dpz.loyalty.getBaseCoupon(), c = a && a.CouponCode !== "" ? "1" : a.LimitPerOrder, d = dpz.loyalty.getCustomerPoints(), f = dpz.loyalty.getPointsRange();
                return simplr.layout.mAssembleLayout({component: "loyaltyWidgetRedemption",tokens: {loyaltyCouponCode: a.CouponCode,pointsBalance: d.BalancePoints,pointsBase: f.BasePoints,itemsPerOrder: c,loyaltyIsOk: dpz.loyalty.loyaltyIsOk()}})
            },callback: function(b, c) {
                if (dpz.loyalty.canRedeem()) {
                    if (a(b).find(".redemption__cta .btn").hide(), a(b).find(".message--warning").hide(), a(b).find(".redemption__cta .btn").show(), c.keepCoupons)
                        a(b).on("click", ".js-rewardsRedemption .btn", function(a) {
                            a.preventDefault();
                            site.func.customerSemiLoggedIn() ? 
                            site.func.showLoginPopup({successCommand: dpz.loyalty.config.commands.redeem}) : site.func.customerLoggedIn() && simplr.controller.mRouteAndExecute("/product/S_PIZZA/builder/?code=12SCREEN&rewardsRedemption=1")
                        })
                } else
                    jsDPZ.app.customer.getCustomer().data.Loyalty.AccountStatus === "SUSPENDED" ? (a(".redemption__cta a").removeClass("none").addClass("inactive"), a(".js-rewardsRedemption .btn").on("click", function(a) {
                        a.preventDefault()
                    })) : dpz.loyalty.store.isParticipating() && dpz.loyalty.getPizzaCount() > 0 ? (a(".message--participation").hide(), 
                    a(b).find(".redemption__cta .btn").addClass("inactive"), a(b).find(".message--warning").show()) : (a(".redemption__cta a").removeClass("none").addClass("inactive"), a(".js-rewardsRedemption .btn").on("click", function(a) {
                        a.preventDefault()
                    }));
                jsDPZ.app.store.getStore().data.StoreID !== "" && !dpz.loyalty.store.isParticipating() && (a(b).find(".message--warning").hide(), dpz.loyalty.store.isParticipating() ? a(b).find(".redemption__cta .btn").addClass("inactive") : a(b).find(".redemption__cta .btn").hide(), dpz.loyalty.getPizzaCount() === 
                0 && a(b).find(".redemption__pizzas").hide(), a(".redemption__cta .message--participation").show())
            }},loyalty_widget_alerts: {html: function() {
                return simplr.layout.mAssembleLayout({component: "loyaltyWidgetAlerts",tokens: {expireDate: moment(jsDPZ.app.customer.getCustomer().data.Loyalty.BasePointExpirationDate, "YYYY-MM-DD").format(dpz.market.marketConfig.dateFormat.DATE),showWarning: dpz.loyalty.isLastActivityInsideWarningTime(),alertClass: dpz.loyalty.isLastActivityInsideWarningTime() ? "alert" : "",loyaltyIsOk: dpz.loyalty.loyaltyIsOk()}})
            },
            callback: function() {
            }},loyalty_details_overlay: {html: function() {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {customClass: "card--overlay--loyalty-details",overlayContent: {component: "loyaltyDetailsOverlay",tokens: {}}}})
            },callback: function(a) {
                site.func.setupLayerCloseEvents({closeSelector: ".js-closeButton",layerSelector: a})
            }}});
    killConfig.localData.gomez = true;
    killConfig.localData.googleAnalytics = true;
    killConfig.localData.webtrendsAnalytics = true;
    killConfig.localData.twitterFollow = 
    true;
    killConfig.localData.googlePlus = true;
    killConfig.localData.facebookLike = true;
    killConfig.localData.stJude = false;
    killConfig.localData.webtrendsAnalytics = true;
    killConfig.localData.mBox = true;
    killConfig.localData.tealium = true;
    a.extend(true, jsDPZ, {app: {nutritionalOrder: {}},config: {app: {LANGUAGE_CODE: dpz.market.activeLanguageCode,MAX_PAST_ITEMS: 10},dataModel: {ADDITIONAL_PIZZA_CATEGORIES: [{Code: "Legend",Name: "Domino's American Legends&reg;"}, {Code: "Feast",Name: "Feast Pizzas"}, {Code: "BuildYourOwn",Name: "Build Your Own"}],
                CUSTOMER: {EmailOptIn: true},DATE_FORMAT: "MM/DD/YYYY _h:mm a_p",ORDER_REQUEST: {SourceOrganizationURI: site.func.isHandheld() ? "resp-order.dominos.com" : "order.dominos.com"},ALLERGEN: {Name: "",Type: ""},INGREDIENT: {Name: "",Ingredients: [],Allergens: []},COMPOSITION: {NutritionalInfo: {GramWeight: "",Calories: "",Protein: "",Carbohydrates: "",DietaryFiber: "",TotalSugar: "",SaturatedFat: "",TransFat: "",Cholesterol: "",VitaminA: "",VitaminC: "",Calcium: "",Sodium: "",CaloriesFromFat: "",CalorieTotal: "",Iron: "",ServingSize: ""},
                    Ingredients: []}}}});
    simplr.view.mAddViews({visualPizzaBubbleOverlay: {html: function(b) {
                b = a.extend({feeds: "",size: ""}, b);
                return simplr.layout.mAssembleLayout({component: "visualPizzaOverlay",tokens: {feeds: b.feeds,size: b.size}})
            },callback: function(b) {
                b = a(b).text().split(" ").length / 2 * 1E3;
                clearTimeout(site.data.bubbleOverlayTimeout);
                site.data.bubbleOverlayTimeout = setTimeout(function() {
                    site.func.visualPizzaBubbleOverlayToggle(false)
                }, b)
            }},trackerBouncebackOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",
                    tokens: {overlayContent: {component: "trackerBouncebackOverlay",tokens: {email: a.userEmail}}}})
            },callback: function(b, c) {
                site.trigger.onPage({group: "upsell",subGroup: "specialtychickenbounceback",title: "Tracker Specialty Chicken Bounceback Popup",uri: "/tracker/upsell/specialtychickenbounceback",subData: "specialtychickenbounceback",subDataGroup: "popup"});
                site.func.stackAttack(b);
                site.func.setupLayerCloseEvents({layerSelector: b,closeSelector: ".js-closeButton"});
                a(".js-closeButton").click(function() {
                    if (!a(this).hasClass("user-submitted"))
                        site.trigger.onEvent({group: "upsell",
                            subGroup: "specialtychickenbounceback Xtoclose",title: "Tracker Specialty Chicken Bounceback Popup Xtoclose",uri: "/tracker/upsell/specialtychickenbounceback/Xtoclose"})
                });
                ({el: a("form", b),inputs: {Email: a(".js-email", b)},init: function() {
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields()
                    },validation: {rules: {Email: {email: true,required: true}},submitHandler: function(b) {
                            var f = simplr.form.mGetValues(b);
                            a.ajax({url: "/bounceback",type: "POST",contentType: "application/json; charset=UTF-8",dataType: "json",
                                data: simplr.conversion.mObjectToJSONString({promotion: c.promotion,email: f.Email,orderid: c.orderID,storeid: c.storeID,phone: c.custPhone})});
                            a(b).fadeOut();
                            setTimeout(function() {
                                a('<p class="confirmationText"/>').hide().html("<span class='success'>Success!</span> We'll send you a coupon code shortly.").appendTo(".formContainer").fadeIn()
                            }, 800);
                            setTimeout(function() {
                                site.func.overlayToggle(false)
                            }, 1E4);
                            site.trigger.onEvent({group: "upsell",subGroup: "specialtychickenbounceback accept",title: "Tracker Specialty Chicken Bounceback Popup Accept",
                                uri: "/tracker/upsell/specialtychickenbounceback/accept"});
                            a(".js-closeButton").addClass("user-submitted")
                        }}}).init()
            }},newUserBouncebackOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "newUserBouncebackOverlay",tokens: {email: a.ajaxData.email}}}})
            },callback: function(b, c) {
                if (c.orderconfirmation)
                    document.querySelector(".confirm-bounceback__email").value = c.ajaxData.email;
                site.func.stackAttack(b);
                var d = jsDPZ.app.customer.getCustomer().data;
                d.Session.hasSeen = d.Session.hasSeen || {};
                d.Session.hasSeen.newUserBounceback = true;
                a(".js-bounceback-opt-in", b).click();
                site.func.setupLayerCloseEvents({layerSelector: b,closeSelector: ".js-closeButton",callback: function() {
                    }});
                a(".js-closeButton").click(function() {
                    a(this).hasClass("user-submitted")
                });
                ({el: a("form", b),inputs: {Email: a(".js-email", b)},init: function() {
                        this.el.focusClass().validate(this.validation);
                        this.el.renderFields()
                    },validation: {rules: {Email: {email: true,required: true}},messages: {Email: {email: "Please enter a valid email address",
                                required: "Please enter a valid email address"}},submitHandler: function(b) {
                            var d = simplr.form.mGetValues(b), g = {promotion: c.ajaxData.promotion,email: d.Email,orderid: c.ajaxData.orderId,storeid: c.ajaxData.storeId,phone: c.ajaxData.phone}, h = a.Deferred(), j;
                            d.OptIn === true ? (j = jsDPZ.app.order.getOrder().data, jsDPZ.ajax.emailOptInAndOut({data: {FirstName: j.Customer.FirstName,LastName: j.Customer.LastName,Email: d.Email,EmailOptIn: true,Street: j.Customer.Address.Street,City: j.Customer.Address.City,Region: j.Customer.Address.Region,
                                    PostalCode: j.Customer.Address.PostalCode},success: function() {
                                    h.resolve(true);
                                    site.trigger.onEvent({group: "AlertCOSBounceBack",subGroup: "COSEmailYes",title: "COSEmailYes",uri: "/en/pages/order/confirmation.jsp"})
                                },error: function() {
                                    h.resolve(false)
                                }})) : setTimeout(function() {
                                h.resolve(null);
                                site.trigger.onEvent({group: "AlertCOSBounceBack",subGroup: "COSEmailNo",title: "COSEmailNo",uri: "/en/pages/order/confirmation.jsp"})
                            }, 1);
                            h.then(function() {
                                a.ajax({url: "/bounceback",type: "POST",contentType: "application/json; charset=UTF-8",
                                    dataType: "json",data: simplr.conversion.mObjectToJSONString(g)});
                                site.trigger.onEvent({group: "AlertCOSBounceback",subGroup: "COSEmailOptIn",title: "COSEmailOptIn",uri: "/en/pages/order/confirmation.jsp"});
                                setTimeout(function() {
                                    a(".confirmationText").fadeIn()
                                }, 800);
                                setTimeout(function() {
                                    site.func.overlayToggle(false)
                                }, 1E4);
                                a(".js-closeButton").addClass("user-submitted")
                            });
                            a(b).fadeOut();
                            return false
                        }}}).init()
            }},panUpsellOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",
                    tokens: {overlayContent: {component: "panUpsellOverlay",tokens: {panelNumber: a.panelNumber,panelName: a.panelName,defaultCoupon: a.defaultCoupon,upsellCoupon: a.upsellCoupon,couponPrice: dpz.template.translateMoney(a.couponPrice)}}}})
            },callback: function(b, c) {
                var d = a.extend({recoverable: true}, c);
                site.trigger.onEvent({group: "Upsell",subGroup: c.couponPrice === "2.00" ? "Pan Pizza Upsell 2 dollar" : "Pan Pizza Upsell 1 dollar",title: c.couponPrice === "2.00" ? "Upsell - Pan Pizza Upsell 2 dollar" : "Upsell - Pan Pizza Upsell 1 dollar",
                    uri: c.couponPrice === "2.00" ? "/upsell/panpizzaupselltwodollar" : "/upsell/panpizzaupsellonedollar"});
                var f = a(".js-nothanks", b).attr("href");
                a(".card--overlay").addClass("card--overlay--large");
                d.recoverable || a(".js-closeButton", b).not(".btn").remove();
                simplr.util.mEmpty(c.url) || a.ajax({url: c.url,data: {type: "layer"},success: function(c) {
                        a(".js-content", b).html(c)
                    }});
                site.func.setupLayerCloseEvents({layerSelector: b,closeSelector: ".js-closeButton, .js-nothanks, .js-continue",callback: function(b) {
                        var d = c.couponPrice.charAt(0);
                        if (a(b).is(".js-nothanks")) {
                            if (site.trigger.onEvent({group: "Upsell",subGroup: "Pan Pizza Upsell " + d + " dollar reject",title: "Upsell - Pan Pizza Upsell " + d + " dollar reject",uri: "/upsell/panpizzaupsell" + d + "dollarreject"}), !c.toutAddCoupon)
                                window.location.href = a(b).attr("href")
                        } else if (a(b).is(".js-continue")) {
                            if (site.trigger.onEvent({group: "Upsell",subGroup: "Pan Pizza Upsell " + d + " dollar accept",title: "Upsell - Pan Pizza Upsell " + d + " dollar accept",uri: "/upsell/panpizzaupsell" + d + "dollaraccept"}), !c.toutAddCoupon)
                                window.location.href = 
                                a(b).attr("href")
                        } else if (a(b).is(".js-closeButton"))
                            site.trigger.onEvent({group: "Upsell",subGroup: "Pan Pizza Upsell " + d + " dollar X to Close",title: "Upsell - Pan Pizza Upsell " + d + " dollar X to Close",uri: "/upsell/panpizzaupsell" + d + "dollarXtoclose"}), c.toutAddCoupon ? simplr.controller.mRouteAndExecute(site.func.buildURL({url: f})) : window.location.href = f
                    }});
                a(".js-toutAddCoupon", b).on("click", function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({url: a(this).attr("href")}));
                    var b = a("#js-mainSiteNavigation a.active").text(), c = a(this).data("wt-panelname"), d = a(this).data("wt-panelnumber");
                    site.trigger.onEvent({title: b + " " + c,group: b,subGroup: c,so: "entreesall",panelNumber: d,panelName: c})
                })
            }},AB_panUpsell2v3_panUpsellOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "AB_panUpsell2v3_panUpsellOverlay",tokens: {panelNumber: a.panelNumber,panelName: a.panelName,defaultCoupon: a.defaultCoupon,upsellCoupon: a.upsellCoupon,
                                couponPrice: a.couponPrice,title: a.title,message: a.message,imageCode: a.imageCode}}}})
            },callback: function(b, c) {
                var d = a.extend({recoverable: true}, c);
                site.trigger.onEvent({group: "Upsell",subGroup: c.couponPrice === "2.00" ? "Pan Pizza Upsell 2 dollar" : "Pan Pizza Upsell 1 dollar",title: c.couponPrice === "2.00" ? "Upsell - Pan Pizza Upsell 2 dollar" : "Upsell - Pan Pizza Upsell 1 dollar",uri: c.couponPrice === "2.00" ? "/upsell/panpizzaupselltwodollar" : "/upsell/panpizzaupsellonedollar"});
                var f = a(".js-nothanks", b).attr("href");
                a(".card--overlay").addClass("card--overlay--large");
                a(".card__image--upsell", b).attr("src", urlConfig.assets + "/images/img/coupons/larges/" + d.imageCode + ".jpg");
                d.recoverable || a(".js-closeButton", b).not(".btn").remove();
                simplr.util.mEmpty(c.url) || a.ajax({url: c.url,data: {type: "layer"},success: function(c) {
                        a(".js-content", b).html(c)
                    }});
                site.func.setupLayerCloseEvents({layerSelector: b,closeSelector: ".js-closeButton, .js-nothanks, .js-continue",callback: function(b) {
                        var d = c.couponPrice.charAt(0);
                        if (a(b).is(".js-nothanks")) {
                            if (site.trigger.onEvent({group: "Upsell",
                                subGroup: "Pan Pizza Upsell " + d + " dollar reject",title: "Upsell - Pan Pizza Upsell " + d + " dollar reject",uri: "/upsell/panpizzaupsell" + d + "dollarreject"}), !c.toutAddCoupon)
                                window.location.href = a(b).attr("href")
                        } else if (a(b).is(".js-continue")) {
                            if (site.trigger.onEvent({group: "Upsell",subGroup: "Pan Pizza Upsell " + d + " dollar accept",title: "Upsell - Pan Pizza Upsell " + d + " dollar accept",uri: "/upsell/panpizzaupsell" + d + "dollaraccept"}), !c.toutAddCoupon)
                                window.location.href = a(b).attr("href")
                        } else if (a(b).is(".js-closeButton"))
                            site.trigger.onEvent({group: "Upsell",
                                subGroup: "Pan Pizza Upsell " + d + " dollar X to Close",title: "Upsell - Pan Pizza Upsell " + d + " dollar X to Close",uri: "/upsell/panpizzaupsell" + d + "dollarXtoclose"}), c.toutAddCoupon ? simplr.controller.mRouteAndExecute(site.func.buildURL({url: f})) : window.location.href = f
                    }});
                a(".js-toutAddCoupon", b).on("click", function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({url: a(this).attr("href")}));
                    var b = a("#js-mainSiteNavigation a.active").text(), c = a(this).data("wt-panelname"), d = a(this).data("wt-panelnumber");
                    site.trigger.onEvent({title: b + " " + c,group: b,subGroup: c,so: "entreesall",panelNumber: d,panelName: c})
                })
            }},mediumPizzaUpsellOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "mediumPizzaUpsellOverlay",tokens: {defaultCoupon: a.defaultCoupon,upsellCoupon: a.upsellCoupon}}}})
            },callback: function(b, c) {
                var d = a.extend({recoverable: true}, c);
                site.trigger.onEvent({group: "Upsell",subGroup: "Homepage Medium 2-Topping Pizza",title: "Upsell - M2T",
                    uri: "/homepageupsell/mediumtwotopping"});
                var f = a(".js-nothanks", b).attr("href");
                a(".overlayContentFrame").css("width", "800px");
                d.recoverable || a(".js-closeButton", b).not(".btn").remove();
                simplr.util.mEmpty(c.url) || a.ajax({url: c.url,data: {type: "layer"},success: function(c) {
                        a(".js-content", b).html(c)
                    }});
                site.func.setupLayerCloseEvents({layerSelector: b,closeSelector: ".js-closeButton, .js-nothanks, .js-continue",callback: function(b) {
                        if (a(b).is(".js-nothanks")) {
                            if (!c.toutAddCoupon)
                                window.location.href = a(b).attr("href")
                        } else if (a(b).is(".js-continue")) {
                            if (site.trigger.onEvent({group: "Upsell",
                                subGroup: "Homepage Medium 2-Topping Pizza accept",title: "Upsell - M2T accept",uri: "/homepageupsell/mediumtwotoppingaccept"}), !c.toutAddCoupon)
                                window.location.href = a(b).attr("href")
                        } else if (a(b).is(".js-closeButton"))
                            c.toutAddCoupon ? simplr.controller.mRouteAndExecute(site.func.buildURL({url: f})) : window.location.href = f
                    }});
                a(".js-toutAddCoupon", b).on("click", function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({url: a(this).attr("href")}));
                    a("#js-mainSiteNavigation a.active").text();
                    a(this).data("wt-panelname");
                    a(this).data("wt-panelnumber")
                })
            }},sandwichSliceOverlay: {html: function(a) {
                return simplr.layout.mAssembleLayout({component: "genericOverlay",tokens: {overlayContent: {component: "sandwichSliceOverlay",tokens: {panelNumber: a.panelNumber,panelName: a.panelName,defaultCoupon: a.defaultCoupon,upsellCoupon: a.upsellCoupon,couponPrice: dpz.template.translateMoney(a.couponPrice)}}}})
            },callback: function(b, c) {
                var d = a.extend({recoverable: true}, c);
                site.trigger.onEvent({group: "Upsell",subGroup: "Sandwich Slice Upsell 5 dollar",
                    title: "Upsell - Sandwich Slice Upsell 5 dollar",uri: "/upsell/sandwichslicefivedollar"});
                var f = a(".js-nothanks", b).attr("href");
                a(".card--overlay").addClass("card--overlay--large");
                d.recoverable || a(".js-closeButton", b).not(".btn").remove();
                simplr.util.mEmpty(c.url) || a.ajax({url: c.url,data: {type: "layer"},success: function(c) {
                        a(".js-content", b).html(c)
                    }});
                site.func.setupLayerCloseEvents({layerSelector: b,closeSelector: ".js-closeButton, .js-nothanks, .js-continue",callback: function(b) {
                        var d = c.couponPrice.charAt(0);
                        if (a(b).is(".js-nothanks")) {
                            if (site.trigger.onEvent({group: "Upsell",subGroup: "Sandwich Slice Upsell " + d + " dollar reject",title: "Upsell - Sandwich Slice Upsell " + d + " dollar reject",uri: "/upsell/sandwichsliceupsell" + d + "dollarreject"}), !c.toutAddCoupon)
                                window.location.href = a(b).attr("href")
                        } else if (a(b).is(".js-continue")) {
                            if (site.trigger.onEvent({group: "Upsell",subGroup: "Sandwich Slice Upsell " + d + " dollar accept",title: "Upsell - Sandwich Slice Upsell " + d + " dollar accept",uri: "/upsell/sandwichsliceupsell" + 
                                d + "dollaraccept"}), !c.toutAddCoupon)
                                window.location.href = a(b).attr("href")
                        } else if (a(b).is(".js-closeButton"))
                            site.trigger.onEvent({group: "Upsell",subGroup: "Sandwich Slice Upsell " + d + " dollar X to Close",title: "Upsell - Sandwich Slice Upsell " + d + " dollar X to Close",uri: "/upsell/sandwichsliceupsell" + d + "dollarXtoclose"}), c.toutAddCoupon ? simplr.controller.mRouteAndExecute(site.func.buildURL({url: f})) : window.location.href = f
                    }});
                a(".js-toutAddCoupon", b).on("click", function(b) {
                    b.preventDefault();
                    simplr.controller.mRouteAndExecute(site.func.buildURL({url: a(this).attr("href")}));
                    var b = a("#js-mainSiteNavigation a.active").text(), c = a(this).data("wt-panelname"), d = a(this).data("wt-panelnumber");
                    site.trigger.onEvent({title: b + " " + c,group: b,subGroup: c,so: "entreesall",panelNumber: d,panelName: c})
                })
            }}});
    a.extend(true, site, {data: {uiConfig: {AVAILABLE_FEEDSIZE_ARRAY: [],AVAILABLE_FEEDSIZE_HASH: {}},productDefaults: {S_BUILD: {DefaultToppings: "Xf=1"}},OWtest: ""},func: {visualPizzaBubbleOverlayToggle: function(b, c) {
                if (b) {
                    var d = {defaultContent: simplr.view.mData().Views.visualPizzaBubbleOverlay.html(c),
                        callback: function() {
                            simplr.view.mData().Views.visualPizzaBubbleOverlay.callback("#visualPizzaBubbleOverlay", c)
                        }}, f = a("#pizzaCanvas").offset(), d = a.extend({id: "visualPizzaBubbleOverlay",xPos: f.left + 90,yPos: f.top + 110,keepCentered: false,defaultContent: "",callback: function() {
                        }}, d);
                    simplr.ui.layer.mCreate(d)
                } else
                    a("#visualPizzaBubbleOverlay").fadeOut(function() {
                        simplr.ui.layer.mDestroy({id: "visualPizzaBubbleOverlay"})
                    })
            },localizeFlash: function(b) {
                typeof b === "string" && (b = {file: b});
                b = a.extend(true, {file: "",
                    lang: dpz.market.activeLanguageCode}, b);
                if (typeof b.file !== "string" || simplr.util.mEmpty(b.file))
                    return "file is either empty or not a string";
                switch (b.lang.toLowerCase()) {
                    case "es":
                        return b.file.replace(/_EN/, "_" + b.lang.toUpperCase()).replace(/_en/, "_" + b.lang.toLowerCase());
                    default:
                        return b.file
                }
            },loadHashFromFlash: function(a) {
                simplr.controller.mRouteAndExecute(site.func.buildURL({url: a}))
            },loadRouteFromFlash: function(a) {
                window.location.href = a
            }}});
    a(function() {
        var a = !simplr.util.mEmpty(simplr.cookie.mGet({name: "sr_token"})), 
        c = !simplr.util.mEmpty(jsDPZ.app.order.getOrder().data.Partners.ShopRunner);
        if (a && !c || !a && c)
            simplr.cookie.mExpire({name: "sr_token"}), delete jsDPZ.app.order.getOrder().data.Partners.ShopRunner, site.sessionTools.save({async: false})
    });
    (function(a, c) {
        function d(a) {
            var b, c, d = {};
            if (b = /#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(a))
                c = [parseInt(b[1], 16), parseInt(b[2], 16), parseInt(b[3], 16), 1];
            else if (b = /#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(a))
                c = [parseInt(b[1], 16) * 17, parseInt(b[2], 16) * 
                    17, parseInt(b[3], 16) * 17, 1];
            else if (b = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(a))
                c = [parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3], 10), 1];
            else if (b = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9\.]*)\s*\)/.exec(a))
                c = [parseInt(b[1], 10), parseInt(b[2], 10), parseInt(b[3], 10), parseFloat(b[4])];
            d = (b = /(-?[0-9]+)(?:px)?\s+(-?[0-9]+)(?:px)?(?:\s+(-?[0-9]+)(?:px)?)?(?:\s+(-?[0-9]+)(?:px)?)?/.exec(a)) ? {left: parseInt(b[1], 10),top: parseInt(b[2], 10),blur: b[3] ? 
                parseInt(b[3], 10) : 0,spread: b[4] ? parseInt(b[4], 10) : 0} : {left: 0,top: 0,blur: 0,spread: 0};
            d.inset = /inset/.test(a);
            d.color = c;
            return d
        }
        a.extend(true, a, {support: {rgba: function() {
                    var c = a("script:first"), d = c.css("color"), f = false;
                    if (/^rgba/.test(d))
                        f = true;
                    else
                        try {
                            f = d != c.css("color", "rgba(0, 0, 0, 0.5)").css("color"), c.css("color", d)
                        } catch (j) {
                        }
                    return f
                }()}});
        var f;
        a.each(["boxShadow", "MozBoxShadow", "WebkitBoxShadow"], function(c, d) {
            var h = a("html").css(d);
            if (typeof h == "string" && h != "")
                return f = d, false
        });
        f && (a.fx.step.boxShadow = 
        function(e) {
            if (!e.init) {
                e.begin = d(a(e.elem).get(0).style[f] || a(e.elem).css(f));
                e.end = a.extend({}, e.begin, d(e.end));
                if (e.begin.color == c)
                    e.begin.color = e.end.color || [0, 0, 0];
                e.init = true
            }
            var g = e.elem.style, h = f, j;
            j = e.begin;
            var k = e.end, e = e.pos, l = [];
            j.inset && l.push("inset");
            typeof k.left != "undefined" && l.push(parseInt(j.left + e * (k.left - j.left), 10) + "px " + parseInt(j.top + e * (k.top - j.top), 10) + "px");
            typeof k.blur != "undefined" && l.push(parseInt(j.blur + e * (k.blur - j.blur), 10) + "px");
            typeof k.spread != "undefined" && l.push(parseInt(j.spread + 
            e * (k.spread - j.spread), 10) + "px");
            if (typeof k.color != "undefined") {
                var m = "rgb" + (a.support.rgba ? "a" : "") + "(" + parseInt(j.color[0] + e * (k.color[0] - j.color[0]), 10) + "," + parseInt(j.color[1] + e * (k.color[1] - j.color[1]), 10) + "," + parseInt(j.color[2] + e * (k.color[2] - j.color[2]), 10);
                a.support.rgba && (m += "," + parseFloat(j.color[3] + e * (k.color[3] - j.color[3])));
                m += ")";
                l.push(m)
            }
            j = l.join(" ");
            g[h] = j
        })
    })(jQuery);
    a(function() {
        a("#pageFooter a").on("click", function(b) {
            var b = a(b.target).text() != "" ? a(b.target).text() : a(b.target).attr("alt"), 
            c = "/footer/" + b.toLowerCase().replace(/ /g, "_").replace(/\./g, "");
            site.trigger.onEvent({title: "Footer " + b,uri: c,group: "Footer Buttons",subGroup: b})
        });
        a("header[role='banner'] .site-nav__main a").add("header[role='banner'] .logo").on("click", function(b) {
            var b = a(b.target).text() != "" ? a(b.target).text() : a(b.target).attr("alt"), c = "/header/" + b.toLowerCase().replace(/ /g, "_").replace(/\./g, "");
            site.trigger.onEvent({title: "Header " + b,uri: c,group: "Header Buttons",subGroup: b})
        })
    });
    (function() {
        function b() {
            setTimeout(function() {
                var b = 
                setInterval(function() {
                    if (a("#genericOverlay").size() === 0) {
                        clearInterval(b);
                        var c = simplr.cookie.mGet({name: "routePast"});
                        if (c)
                            site.trigger.onPage(jsDPZ.dataConversion.JSONStringToObject(c))
                    }
                }, 100)
            }, 500)
        }
        window.useDynamicTitleTags = false;
        var c = document.title;
        require(["dpz.template"], function(d) {
            simplr.trigger.mAddServices({"Title Tags": {data: {environmentIDs: {localhost: true,"nolo-us-dev": true,"nolo-us-dev2": true,"nolo-us-qa": true,"nolo-us-qa2": true,"nolo-us-preprod": true,"nolo-us-prod": true,"golo-dev1": true,
                            "golo-dev2": true,"golo-dev3": true,"golo-dev4": true,"golo-qa": true,"golo-preprod": true,"golo-prod1": true,"golo-prod2": true,"golo-va-prod1": true,"golo-va-prod2": true,"golo-de-prod1": true,"golo-de-prod2": true}},onPage: function(f) {
                        var e = function() {
                            var a = Array.prototype.slice.call(arguments);
                            return a[0] ? (a[0] = "titles." + a[0], result = d.translate.apply(null, a), result.replace(/^titles\./, "")) : ""
                        };
                        site.sessionTools.resetTimeout();
                        var g = e(c), h = "", j = "", k = false, l = false, m = f.route.resources;
                        if ("section" in m && "category" in 
                        m)
                            g = e(m.section + m.category) + " - " + g, simplr.cookie.mSet({name: "routePast",value: jsDPZ.dataConversion.JSONObjectToString(f)});
                        else {
                            var n = jsDPZ.app.catalog.getCatalog();
                            a.each(m, function(a, b) {
                                h += a;
                                switch (a.toLowerCase()) {
                                    case "product":
                                        var c = n.getProduct(m.product).data;
                                        j = jsDPZ.util.htmlUnEncode(c.Name);
                                        c.Name !== c.ProductType && (j = c.ProductType == "Wings" ? "Chicken " + j : c.ProductType == "GSalad" ? "Salad " + j : c.ProductType == "Sides" ? "Extras " + j : c.ProductType + " " + j);
                                        j += " ";
                                        break;
                                    case "upsell":
                                        l = true;
                                        h += b;
                                        break;
                                    case "builder":
                                    case "fulfiller":
                                        k = true;
                                        break;
                                    case "order":
                                    case "storeid":
                                    case "location":
                                        break;
                                    case "variant":
                                        c = jsDPZ.app.order.getOrder().getItemData({ID: m.variant});
                                        c = n.getVariant(c.Code).data.ProductCode;
                                        c = n.getProduct(c).data;
                                        j = c.Name;
                                        j != c.ProductType && (j = c.ProductType + " " + j);
                                        j += " ";
                                        k = true;
                                        break;
                                    default:
                                        h += b
                                }
                            });
                            h && (g = j + e(h) + " - " + g);
                            !k && !l ? simplr.cookie.mSet({name: "routePast",value: jsDPZ.dataConversion.JSONObjectToString(f)}) : k && (b(), k = false)
                        }
                        g = jsDPZ.util.htmlUnEncode(g);
                        a(document).trigger("documentTitleSet", 
                        [g]);
                        return document.title = g
                    }}})
        })
    })()
})(jQuery);

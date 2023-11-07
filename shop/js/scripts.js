var isMobile = !1,
        isApple = !1,
        animateIt = !0,
        blogCols = 3,
        gViewMode = 'grid',
        gNewDays = 7,
        words = {
                plusIcon: '\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C',
                minusIcon: '\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C',
                allPhotos: '\u0412\u0441\u0435',
                upButton: '\u0412\u0432\u0435\u0440\u0445 \u2191',
                removeGood: '\u0423\u0434\u0430\u043B\u0438\u0442\u044C',
                showMore: '\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0435'
        };

function animated_contents() {
        $('.animated:appeared')['each'](function (_0xda29x9) {
                var _0xda29xa = $(this),
                        _0xda29xb = $(this)['data']('animated');
                setTimeout(function () {
                        _0xda29xa['addClass'](_0xda29xb)
                }, 100 * _0xda29x9)
        })
}
function setCookie(_0xda29x9, _0xda29xa, _0xda29xb) {
        var _0xda29xd = (_0xda29xb = _0xda29xb || {})['expires'];
        if ('number' == typeof _0xda29xd && _0xda29xd) {
                var _0xda29xe = new Date;
                _0xda29xe['setTime'](_0xda29xe['getTime']() + 1e3 * _0xda29xd),
                _0xda29xd = _0xda29xb['expires'] = _0xda29xe
        };
        _0xda29xd && _0xda29xd['toUTCString'] && (_0xda29xb['expires'] = _0xda29xd['toUTCString']());
        var _0xda29xf = _0xda29x9 + '=' + (_0xda29xa = encodeURIComponent(_0xda29xa));
        for (var _0xda29x10 in _0xda29xb) {
                _0xda29xf += '; ' + _0xda29x10;
                var _0xda29x11 = _0xda29xb[_0xda29x10];
                !0 !== _0xda29x11 && (_0xda29xf += '=' + _0xda29x11)
        };
        document['cookie'] = _0xda29xf
}
function getCookie(_0xda29x9) {
        var _0xda29xa = document['cookie']['match'](new RegExp('(?:^|; )' + _0xda29x9['replace'](/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\$1') + '=([^;]*)'));
        return _0xda29xa ? decodeURIComponent(_0xda29xa[1]) : void(0)
}
function deleteCookie(_0xda29x9) {
        setCookie(_0xda29x9, '', {
                expires: -1
        })
}(navigator['userAgent']['match'](/Android/i) || navigator['userAgent']['match'](/webOS/i) || navigator['userAgent']['match'](/iPhone/i) || navigator['userAgent']['match'](/iPad/i) || navigator['userAgent']['match'](/iPod/i) || navigator['userAgent']['match'](/IEMobile/i) || navigator['userAgent']['match'](/BlackBerry/i)) && (isMobile = !0),
(navigator['userAgent']['match'](/iPhone/i) || navigator['userAgent']['match'](/iPad/i) || navigator['userAgent']['match'](/iPod/i)) && (isApple = !0),
window['onload'] = function () {
        $('#loader')['fadeOut'](500)
},
1 == isMobile && $('.animated')['removeClass']('animated'),
0 == isMobile && 1 == animateIt && $('*[data-animated]')['addClass']('animated'),
0 == isMobile && 1 == animateIt && (animated_contents(), $(window)['scroll'](function () {
        animated_contents()
})),
$(function () {
        $('.search-select')['change'](function () {
                1 == $('.search-select :selected')['val']() ? ($('.search-all')['hide'](), $('.search-shop')['show']()) : ($('.search-shop')['hide'](), $('.search-all')['show']())
        })
}),
$(function () {
        $('.shc-button')['click'](function () {
                $('.shc-block')['slideToggle'](300)
        })
}),
$(function () {
        $('#shop-basket')['on']({
                click: function () {
                        $('#nav')['addClass']('nav-basket-opened')
                },
                mouseleave: function () {
                        $('#nav')['removeClass']('nav-basket-opened')
                }
        })
}),
$(function () {
        $('.user-links')['on']({
                click: function () {
                        $(this)['addClass']('opened')
                },
                mouseleave: function () {
                        $(this)['removeClass']('opened')
                }
        })
}),
$(function () {
        $('.search-form-body')['on']({
                click: function () {
                        $(this)['addClass']('opened')
                },
                mouseleave: function () {
                        $(this)['removeClass']('opened')
                }
        })
}),
$(function () {
        $('<span id="go-top" class="las la-angle-up" title="' + words['upButton'] + '"></span>')['appendTo']('body'),
        $('#go-top')['css']({
                opacity: '0',
                visibility: 'hidden'
        }),
        $(window)['scroll'](function () {
                $(this)['scrollTop']() > 500 ? $('#go-top')['css']({
                        opacity: '1',
                        visibility: 'visible'
                }) : $('#go-top')['css']({
                        opacity: '0',
                        visibility: 'hidden'
                })
        }),
        $('#go-top')['click'](function () {
                return $('body,html')['animate']({
                        scrollTop: 0
                }, 800),
                !1
        })
}),
$(function () {
        $('.top-open')['click'](function () {
                $('.top-line')['slideToggle'](),
                $(this)['find']('span')['toggleClass']('la-angle-down la-angle-up')
        })
}),
$(function () {
        $('input[type="tel"]')['mask']('+7 (999) 999-99-99')
}),
$(function () {
        $('.shc-block > .cat-tree > li')['slice'](8)['hide'](),
        $('.shc-more')['click'](function () {
                $('.shc-block > .cat-tree > li')['slice'](8)['slideToggle'](),
                $(this)['find']('i')['toggleClass']('la-plus la-minus')
        })
}),
$(function () {
        $('#slider')['aSlider']({
                prevBtn: '.slide-arrow.la-arrow-left',
                nextBtn: '.slide-arrow.la-arrow-right',
                fadeSpeed: 500,
                autoPlay: !0,
                autoPlayDelay: 6e3
        })
}),
$(function () {
        $('.goods-carousel-section .gcarousel .goods-list')['each'](function () {
                var _0xda29x9 = $(this),
                        _0xda29xa = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.prev'),
                        _0xda29xb = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.next');
                $(this)['owlCarousel']({
                        items: 6,
                        itemsDesktop: [1647, 5],
                        itemsDesktopSmall: [1268, 4],
                        itemsTablet: [991, 3],
                        itemsTabletSmall: [780, 2],
                        itemsMobile: [567, 1]
                }),
                _0xda29xa['click'](function () {
                        _0xda29x9['trigger']('owl.prev')
                }),
                _0xda29xb['click'](function () {
                        _0xda29x9['trigger']('owl.next')
                })
        }),
        $('.new-goods-carousel .gcarousel .goods-list')['each'](function () {
                var _0xda29x9 = $(this),
                        _0xda29xa = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.prev'),
                        _0xda29xb = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.next');
                $(this)['owlCarousel']({
                        items: 4,
                        itemsDesktop: [1647, 3],
                        itemsDesktopSmall: [1268, 4],
                        itemsTablet: [991, 3],
                        itemsTabletSmall: [780, 2],
                        itemsMobile: [567, 1]
                }),
                _0xda29xa['click'](function () {
                        _0xda29x9['trigger']('owl.prev')
                }),
                _0xda29xb['click'](function () {
                        _0xda29x9['trigger']('owl.next')
                })
        }),
        $('.reviews-carousel .gcarousel .r-list')['each'](function () {
                var _0xda29x9 = $(this),
                        _0xda29xa = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.prev'),
                        _0xda29xb = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.next');
                $(this)['owlCarousel']({
                        items: 1,
                        itemsDesktop: [1199, 1],
                        itemsDesktopSmall: [1268, 1],
                        itemsTablet: [991, 1],
                        itemsTabletSmall: [780, 1],
                        itemsMobile: [567, 1]
                }),
                _0xda29xa['click'](function () {
                        _0xda29x9['trigger']('owl.prev')
                }),
                _0xda29xb['click'](function () {
                        _0xda29x9['trigger']('owl.next')
                })
        }),
        $('.gcarousel .blog-list')['each'](function () {
                var _0xda29x9 = $(this),
                        _0xda29xa = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.prev'),
                        _0xda29xb = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.next');
                $(this)['owlCarousel']({
                        items: 4,
                        itemsDesktop: [1647, 3],
                        itemsDesktopSmall: [1268, 3],
                        itemsTablet: [991, 2],
                        itemsTabletSmall: [780, 1],
                        itemsMobile: [567, 1]
                }),
                _0xda29xa['click'](function () {
                        _0xda29x9['trigger']('owl.prev')
                }),
                _0xda29xb['click'](function () {
                        _0xda29x9['trigger']('owl.next')
                })
        }),
        $('.gp-more-goods .gcarousel .goods-list')['each'](function () {
                var _0xda29x9 = $(this),
                        _0xda29xa = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.prev'),
                        _0xda29xb = $(this)['parent']()['parent']()['parent']()['find']('.gcarouselarrow.next');
                $(this)['owlCarousel']({
                        items: 5,
                        itemsDesktop: [1647, 4],
                        itemsDesktopSmall: [1268, 4],
                        itemsTablet: [991, 3],
                        itemsTabletSmall: [780, 2],
                        itemsMobile: [567, 1]
                }),
                _0xda29xa['click'](function () {
                        _0xda29x9['trigger']('owl.prev')
                }),
                _0xda29xb['click'](function () {
                        _0xda29x9['trigger']('owl.next')
                })
        })
}),
$(function () {
        $('#menu .uMenuRoot > li.uWithSubmenu > a')['append']('<i class="las la-angle-down"></i>'),
        $('#menu .uMenuRoot ul li.uWithSubmenu > a')['append']('<i class="las la-angle-right"></i>'),
        $('.menu-icon')['click'](function () {
                $('body')['addClass']('noscroll'),
                $('#menu .uMenuRoot')['clone']()['appendTo']('.mobile-menu-container'),
                $('.mobile-menu-container')['fadeIn'](300),
                $('.mobile-menu-container .uMenuRoot li.uWithSubmenu > a')['after']('<i class="las la-angle-down"></i>'),
                $('.mobile-menu-container .uMenuRoot li i')['click'](function () {
                        $(this)['toggleClass']('la-angle-down')['toggleClass']('la-angle-up'),
                        $(this)['parent']()['toggleClass']('uWithSubmenuActive')['find']('ul:first')['slideToggle'](300)
                })
        }),
        $('.mobile-menu-container-close')['click'](function () {
                $('.mobile-menu-container')['fadeOut'](300),
                $('.mobile-menu-container .uMenuRoot')['remove'](),
                $('body')['removeClass']('noscroll')
        })
}),
$(function () {
        $(document['body'])['on']('appear', '.count-val', function (_0xda29x9, _0xda29xa) {
                var _0xda29xb = $(this)['data']('count');
                $(this)['is'](':appeared') && !$(this)['hasClass']('starting') && ($(this)['addClass']('starting'), $(this)['countTo']({
                        from: 0,
                        to: _0xda29xb
                }))
        }),
        $('.count-val')['appear']({
                force_process: !0
        })
}),
$(function () {
        $(document['body'])['on']('appear', '.skill-line-wrap > span', function (_0xda29x9, _0xda29xa) {
                var _0xda29xb = $(this)['data']('percent');
                $(this)['is'](':appeared') && !$(this)['hasClass']('skill-starting') && ($(this)['children']('b')['append'](_0xda29xb + '%'), $(this)['addClass']('skill-starting'), $(this)['width']($(this)['parent']()['width']() * _0xda29xb / 100))
        }),
        $('.skill-line-wrap > span')['appear']({
                force_process: !0
        })
}),
$(function () {
        $('.tabs')['aTabs'](),
        $('.gp-tabs')['aTabs']()
}),
$(function () {
        $('.block .catsTd .catNumData')['each'](function () {
                var _0xda29x9 = $(this)['text']()['replace'](/[^0-9]/g, '');
                $(this)['text'](_0xda29x9)
        })
}),
$(function () {
        $('.bbQuoteName, .quoteMessage')['removeAttr']('style')
}),
$(function () {
        $('.g-to-basket-2 input[type="text"]')['before']('<button class="gp-minus" title="' + words['minusIcon'] + '">-</button>'),
        $('.g-to-basket-2 input[type="text"]')['after']('<button class="gp-plus" title="' + words['plusIcon'] + '">+</button>'),
        $('.g-to-basket-2 .gp-plus')['click'](function () {
                var _0xda29x9 = +$(this)['parent']()['find']('input[type="text"]')['val']();
                $(this)['parent']()['find']('input[type="text"]')['val'](_0xda29x9 + 1)
        }),
        $('.g-to-basket-2 .gp-minus')['click'](function () {
                var _0xda29x9 = +$(this)['parent']()['find']('input[type="text"]')['val']();
                _0xda29x9 > 1 && $(this)['parent']()['find']('input[type="text"]')['val'](_0xda29x9 - 1)
        }),
        $('.g-to-basket-2 input[type="button"]')['val']('\uF291')
}),
$(function () {
        $('.gp-buttons input[type="text"]')['before']('<button class="gp-minus" title="' + words['minusIcon'] + '">-</button>'),
        $('.gp-buttons input[type="text"]')['after']('<button class="gp-plus" title="' + words['plusIcon'] + '">+</button>'),
        $('.gp-buttons .gp-plus')['click'](function () {
                var _0xda29x9 = +$('.gp-buttons input[type="text"]')['val']();
                $('.gp-buttons input[type="text"]')['val'](_0xda29x9 + 1)
        }),
        $('.gp-buttons .gp-minus')['click'](function () {
                var _0xda29x9 = +$('.gp-buttons input[type="text"]')['val']();
                _0xda29x9 > 1 && $('.gp-buttons input[type="text"]')['val'](_0xda29x9 - 1)
        })
}),
$(function () {
        $('.order-item-cnt input[type="text"]')['before']('<span class="o-minus" title="' + words['minusIcon'] + '">-</span>'),
        $('.order-item-cnt input[type="text"]')['after']('<span class="o-plus" title="' + words['plusIcon'] + '">+</span>'),
        $('.order-item-cnt .o-plus')['click'](function () {
                var _0xda29x9 = $(this)['parent']()['find']('input[type="text"]'),
                        _0xda29xa = +_0xda29x9['val']();
                _0xda29x9['val'](_0xda29xa + 1)
        }),
        $('.order-item-cnt .o-minus')['click'](function () {
                var _0xda29x9 = $(this)['parent']()['find']('input[type="text"]'),
                        _0xda29xa = +_0xda29x9['val']();
                _0xda29xa > 1 && _0xda29x9['val'](_0xda29xa - 1)
        })
}),
$(function () {
        $('.photo')['parent']()['removeAttr']('id')['removeAttr']('class')['removeAttr']('style')['parent']()['removeAttr']('id')['removeAttr']('class')['removeAttr']('style')['addClass']('photo-wrap col3')['parent']()['removeAttr']('id')['removeAttr']('class')['removeAttr']('style')['addClass']('photo-list')
}),
$(function () {
        $('.faq:first')['addClass']('opened')['find']('.faq-message')['slideToggle'](0),
        $('.faq-title')['click'](function () {
                $(this)['parent']()['hasClass']('opened') ? $(this)['parent']()['toggleClass']('opened')['find']('.faq-message')['slideToggle'](300) : ($('.faq.opened')['removeClass']('opened')['find']('.faq-message')['slideToggle'](300), $(this)['parent']()['toggleClass']('opened')['find']('.faq-message')['slideToggle'](300))
        })
}),
$(function () {
        $('#shop-page-more button')['html'](words['showMore'] + '<i class="las la-angle-down"></i>'),
        $('.block-body ul.cat-tree li')['has']('ul')['addClass']('cat-tree-with-ul'),
        $(window)['width']() < 1279 && $('#sidebar .filters-block')['remove']()['prependTo']('#content')['css']({
                float: 'none',
                width: '100%'
        })
}),
$(window)['resize'](function () {
        $(this)['width']() < 1279 && ($('#sidebar .filters-block')['remove']()['prependTo']('#content')['css']({
                float: 'none',
                width: '100%'
        }), $('.spec-filter')['addClass']('collapsed')),
        $(this)['width']() > 1278 && ($('#content .filters-block')['remove']()['prependTo']('#sidebar'), $('.spec-filter')['removeClass']('collapsed'))
}),
$(function () {
        $('.shop_spec_grp td')['wrapInner']('<div class="shop_spec_grp_td_content"></div>'),
        $('.gp-rev-form')['hide'](),
        $('.gp-show-rev-form')['click'](function () {
                $('.gp-rev-form')['slideToggle']()
        })
}),
$(function () {
        'undefined' != typeof shopFilterMinPrice && $('#price_min')['val'](shopFilterMinPrice),
        'undefined' != typeof shopFilterMaxPrice && $('#price_max')['val'](shopFilterMaxPrice)
}),
$(function () {
        switch (getCookie('itemViewMode')) {
        case 'grid':
                $('.goods-view-mode-grid')['addClass']('goods-view-mode-active'),
                $('#content #goods-cont')['removeClass']('list-item-view-mode-list');
                break;
        case 'list':
                $('.goods-view-mode-list')['addClass']('goods-view-mode-active'),
                $('#content #goods-cont')['addClass']('list-item-view-mode-list'),
                $('.list-item')['each'](function () {
                        $(this)['css']({
                                "\x6D\x69\x6E\x2D\x68\x65\x69\x67\x68\x74": $(this)['find']('.g-image')['height']()
                        })
                });
                break;
        case void(0):
                switch (setCookie('itemViewMode', gViewMode), getCookie('itemViewMode')) {
                case 'grid':
                        $('.goods-view-mode-grid')['addClass']('goods-view-mode-active'),
                        $('#content #goods-cont')['removeClass']('list-item-view-mode-list');
                        break;
                case 'list':
                        $('.goods-view-mode-list')['addClass']('goods-view-mode-active'),
                        $('#content #goods-cont')['addClass']('list-item-view-mode-list')
                }
        };
        $('.goods-view-mode > span')['click'](function () {
                if ($(this)['hasClass']('goods-view-mode-active')) {
                        return !1
                };
                $('.goods-view-mode > span')['removeClass']('goods-view-mode-active'),
                $(this)['addClass']('goods-view-mode-active'),
                $(this)['hasClass']('goods-view-mode-grid') ? (setCookie('itemViewMode', 'grid'), $('#content #goods-cont')['removeClass']('list-item-view-mode-list')) : $(this)['hasClass']('goods-view-mode-list') && (setCookie('itemViewMode', 'list'), $('#content #goods-cont')['addClass']('list-item-view-mode-list'), $('.list-item')['each'](function () {
                        $(this)['css']({
                                "\x6D\x69\x6E\x2D\x68\x65\x69\x67\x68\x74": $(this)['find']('.g-image')['height']()
                        })
                }))
        })
})
var t =  {
    title: "IM PROP",
    type: "object",
    properties: {
        "documents": {
            type: "array",
            format: "table",
            title: "Documents",
            uniqueItems: true,
            items: {
                type: "object",
                title: "Document",
                properties: {
                    "Name": {
                        type: "string"
                    },
                    "upload_default": {
                            type: "string",
                            format: "url",
                            options: {
                            upload: true
                            },
                        "links": [
                          {
                              "href": "{{self}}"
                          }
                        ]
                    },
                    "Category": {
                        type: "string",
                        "enum": [
                            "SSI",
                            "Trading Authorization",
                            "Incorporation",
                            "Misc",
                            "Regulation",
                            "Tax",
                            "Fund",
                            "AML",
                            "Financials",
                            "SIA 151",
                            "KYC",
                            "Options",
                            "MIFID",
                            "Compliance Alert",
                            "Comm Share Agreement",
                            "EGUS",
                            "Terms Of Business",
                            "Fund Admin",
                            "CDD",
                            "Inv Mgmt Agreement",
                            "Passport",
                            "ID Confirmation",
                            "F1SA",
                            "Prospectus",
                            "CDC,OFAC,PEP",
                            "Audited Financials",
                            "Residential Address",
                            "Contacts",
                            "Mem and Arts",
                            "Directors",
                            "Name Change",
                            "Auth Signatories",
                            "ID Confirmation",
                            "OATS",
                            "Proof of Address",
                            "COMFORT LETTER",
                            "Driving Licence",
                            "Softdollar Agreement",
                            "W-8BEN-E",
                            "Foreign Bank Certification",
                            "Assets Under Mgmt"
                        ]
                    }

                }
            }
        },
        "notes": {
            type: "array",
            format: "table",
            title: "Notes",
            uniqueItems: true,
            items: {
                type: "object",
                title: "Notes",
                properties: {
                    "mpf_note_comments": {
                        title: "Comment",
                        type: "string"
                    },
                    "mpf_note_date": {
                        title: "Date",
                        type: "string",
                        format: "date"
                    },
                    "mpf_note_uid": {
                        title: "Author",
                        type: "string"
                    }
                }
            }
        },
        "location": {
            type: "object",
            title: "Location Parent Object",
            properties: {
                "location_nested": {
                    type: "object",
                    title: "Location (nested)",
                    properties: {
                        "city": {
                            type: "string",
                            "default": "San Francisco"
                        },
                        "state": {
                            type: "string",
                            "default": "CA"
                        },
                        "citystate": {
                            type: "string",
                            "description": "This is generated automatically from the previous two fields (inner)",
                            "template": "{{city}}, {{state}}",
                            "watch": {
                                "city": "location.location_nested.city",
                                "state": "location.location_nested.state"
                            }
                        }
                    }
                },
                        }
        },
        "mpf_name": {
            type: "string",
            title: "IM PROP Name"
        },
        "im_cat_id": {
            type: "string",
            title: "Category",
            "enum": [
                "Other",
                "Hedge Fund",
                "Fund Manager",
                "Bank Proprietary Trading Desk",
                "Hedge Fund – Prop Trading",
                "Broker",
                "Hedge Fund - Research Only",
                "Mutual Fund",
                "US Broker Dealer",
                "Govt Entity"
            ],
            "default": "undefined"
        },
        "mpf_risk_id": {
            type: "string",
            title: "Risk",
            "enum": [
                "Low",
                "Medium",
                "High"
            ],
            "default": "undefined"
        },
        "mpf_dd_id": {
            type: "string",
            title: "Due Diligence",
            "enum": [
                "Simplified due diligence",
                "Customer due diligence",
                "Enhanced due diligence"
            ],
            "default": "undefined"
        },

        /* Registered Address:*/
        "mpf_reg_address": {
            type: "string",
            title: "Address"
        },
        "mpf_reg_city": {
            type: "string",
            title: "City"
        },
        "mpf_reg_state": {
            type: "string",
            title: "State"
        },
        "mpf_reg_postcode": {
            type: "string",
            title: "Post Code/ZIP"
        },
        "mpf_reg_country": {
            type: "string",
            title: "Country"
        },

        /* Business Address: */
        "mpf_biz_address": {
            type: "string",
            title: "Address"
        },
        "mpf_biz_city": {
            type: "string",
            title: "City"
        },
        "mpf_biz_state": {
            type: "string",
            title: "State"
        },
        "mpf_biz_postcode": {
            type: "string",
            title: "Post Code/ZIP"
        },
        "mpf_biz_country": {
            type: "string",
            title: "Country"
        },
        "mpf_registered_no": {
            type: "string",
            title: "Registered number"
        },
        "mpf_directors": {
            type: "string",
            title: "Directors",
            format: "textarea",
            "options": {
                "input_height": "50px"
            }
        },
        "mpf_isopen": {
            type: "boolean",
            format: "checkbox",
            title: "Is Open?"
        },
        "mpf_open_date": {
            type: "string",
            format: "date",
            title: "Open date:"
        },
        "mpf_close_date": {
            type: "string",
            format: "date",
            title: "Close date:"
        },
        "regulatory_body_id": {
            type: "string",
            title: "Regulatory Body",
            "enum": [
                "USAPATRIOT ACT|USAPATRIOT ACT",
                "TWSE|Taiwan Stock Exchange Corp",
                "SICCFIN|SERVICE D'INFORMATION ET DE CONTROLE SUR LES CIRCUITES FINANCIERS",
                "SFC|Securities and Futures Commission",
                "SECOM MALAYSIA|Securities Commission Malaysia",
                "SEC|SECURITIES AND EXCHANGE COMMISSION",
                "SCB|The Securities Commission of The Bahamas",
                "SAAM|SWISS ASSOCIATION OF ASSET MANAGERS",
                "PHLX|Philadelphia Stock Exchange",
                "PFTS|PFTS Stock Exchange, Ukraine",
                "OSFI|Office of the Superintendent of Financial Institutions Canada",
                "OSFI|Office of the Superintendent of Financial Institutions Canada",
                "OSC|ONTARIO SECURITIES COMMISION",
                "OARG|ORGANISME D'AUTOREGULATION",
                "NZFSP|New Zealand Financial Services Provider Register",
                "NFA|NATIONAL FUTURES ASSOCIATION",
                "MFSA|Malta Financial Services Authority",
                "MAS|MONETARY AUTHORITY OF SINGAPORE",
                "LISTED|Listed on regulated exchange",
                "JFSC|Jersey Financial Services Commission",
                "IOM FSC|Isle of Man Financial Supervision Commission",
                "INAF|Institut Nacional Andorra De Finances",
                "IFS|IRISH FINANCIAL SERVICES REGULATOR",
                "HCMC|Hellenic Capital Market Commission",
                "GOVERNMENT|GOVT PENSION FUND",
                "GFSC|Guernsey Financial Services Commission",
                "Finansinspektionen|Swedish Financial Supervisory Authority",
                "Financial Supervisory Service of Korea|Financial Supervisory Service of Korea",
                "FSS Korea|Financial Supervisory Service of Korea",
                "FSCM|Financial Services Commission of Mauritius",
                "FSCB|Financial Supervision Commission of Bulgaria",
                "FSC|Financial Services Commission of Gibraltar",
                "FSB|Financial Services Board South Africa",
                "FSAN|The Financial Supervisory Authority of Norway",
                "FSAJP|Financial Services Agency Japan",
                "FMSA|Financial Market Stabilisation Agency",
                "FMA|Financial Market Authority Liechtenstein",
                "FINRA|FINANCIAL INDUSTRY REGULATORY AUTHORITY",
                "FINMA|Swiss Financial Market Supervisory Authority",
                "FCA|FINANCIAL CONDUCT AUTHORITY",
                "Danish FSA|Finanstilsynet",
                "CSSF|Commission de Surveillance du Secteur Financier - Luxembourg",
                "CSEC|Cyprus Securities and Exchange Commission",
                "CSA|Canadian Securities Administrators",
                "CNMV|Comisión Nacional del Mercado de Valores",
                "CIMA|Cayman Islands Monetary Authority",
                "CCAF|Commission de Controle des Activities Financiers",
                "CBOE|CHICAGO BOARD OPTIONS EXCHANGE",
                "CBIE|Central Bank of Ireland",
                "BVIFSC|British Virgin Islands Financial Services Commission",
                "BOS|BANK OF SLOVENIA",
                "BMA|Bermuda Monetary Authority",
                "BI|BANK D\'ITALIA",
                "BF|Banque de France",
                "BDP|Banco De Portugal",
                "BDE|Banco De Espana",
                "BAFIN|German Federal Financial Supervisory Authority",
                "ATVP|Securities Market Agency Slovenia",
                "ATVP|Securities Market Agency Slovenia",
                "ASIC|AUSTRALIAN SECURITIES & INVESTMENTS COMMISSION",
                "AMF|AUTORITE DES MARCHES FINANCIERS",
                "AFM|Netherlands Authority For the Financial Markets"
            ],
            "default": "undefined"
        },

        "im_prop_assets": {
            type: "string",
            title: "Assets Under Management",
            "enum": [
                "Not Disclosed",
                "Less than 100 M",
                "More than 100 M",
                "Less than 50 M"
            ],
            "default": "undefined"
        },
        "im_prop_regulator_no": {
            type: "string",
            title: "Regulator number"
        },


        "im_oasys_account": {
            type: "string",
            title: "Account"
        },
        "im_oasys_block": {
            type: "string",
            title: "Oasis block?",
            "enum": [
                "Other",
                "Allocation"
            ],
            "default": "undefined"
        },
        "im_oasys_gacronym": {
            type: "string",
            title: "Global Acronym"
        },
        "im_oasys_dacronym": {
            type: "string",
            title: "Domestic Acronym"
        },
        "_im_cc_bda": {
            type: "boolean",
            format: "checkbox",
            title: "CC BDA"
        },
        "_im_cc_usa": {
            type: "boolean",
            format: "checkbox",
            title: "CC USA"
        }
    }
}
            , layout_schema: {
                "groups": [
                  {
                      "Id": "LeftTopGroup",
                      "OtherFields": true,
                      "Fields": [
                        {
                            "Path": "root.location.location_nested"
                        },
                        {
                            "Path": "root.mpf_name"
                        },
                        {
                            "Path": "root.im_cat_id"
                        },
                        {
                            "Path": "root.mpf_risk_id"
                        },
                        {
                            "Path": "root.mpf_dd_id"
                        }
                      ]
                  },
                  {
                      "Id": "LeftMiddleGroup",
                      "Fields": [
                        {
                            "Path": "root.mpf_reg_address"
                        },
                        {
                            "Path": "root.mpf_reg_city"
                        },
                        {
                            "Path": "root.mpf_reg_state"
                        },
                        {
                            "Path": "root.mpf_reg_postcode"
                        },
                        {
                            "Path": "root.mpf_reg_country"
                        }
                      ]
                  },
                  {
                      "Id": "LeftBottomGroup",
                      "Fields": [
                        {
                            "Path": "root.mpf_biz_address"
                        },
                        {
                            "Path": "root.mpf_biz_city"
                        },
                        {
                            "Path": "root.mpf_biz_state"
                        },
                        {
                            "Path": "root.mpf_biz_postcode"
                        },
                        {
                            "Path": "root.mpf_biz_country"
                        }
                      ]
                  },
                  {
                      "Id": "RightTopGroup",
                      "Fields": [
        {
            "Path": "root.location"
        },
                        {
                            "Path": "root.mpf_directors"
                        },
                        {
                            "Path": "root.mpf_isopen"
                        },
                        {
                            "Path": "root.mpf_open_date"
                        },
                        {
                            "Path": "root.mpf_close_date"
                        },
                        {
                            "Path": "root.regulatory_body_id"
                        },
                        {
                            "Path": "root.im_prop_assets"
                        },
                        {
                            "Path": "root.im_prop_regulator_no"
                        }
                      ]
                  },
                  {
                      "Id": "RightBottomGroup",
                      "Fields": [
                        {
                            "Path": "root.im_oasys_account"
                        },
                        {
                            "Path": "root.im_oasys_block"
                        },
                        {
                            "Path": "root.im_oasys_gacronym"
                        },
                        {
                            "Path": "root.im_oasys_dacronym"
                        },
                        {
                            "Path": "root._im_cc_bda"
                        },
                        {
                            "Path": "root._im_cc_usa"
                        }
                      ]
                  },
                  {
                      "Id": "BottomGroup",
                      "Fields": [
                            {
                                "Path": "root.documents"
                            },
                            {
                                "Path": "root.notes"
                            }
                      ]
                  }
                ],
                "layout": [
                  {
                      type: "container",
                      "attributes": [
                        {
                            "name": "style",
                            "value": "float: left;"
                        }
                      ],
                      "childBlocks": [
                        {
                            type: "group",
                            "RefId": "LeftTopGroup"
                        },
                        {
                            type: "separator"
                        },
                        {
                            type: "group",
                            "RefId": "LeftMiddleGroup"
                        },
                        {
                            type: "separator"
                        },
                        {
                            type: "group",
                            "RefId": "LeftBottomGroup"
                        }
                      ]
                  },
                  {
                      type: "container",
                      "attributes": [
                        {
                            "name": "style",
                            "value": "float: right;"
                        }
                      ],
                      "childBlocks": [
                        {
                            type: "group",
                            "RefId": "RightTopGroup"
                        },
                        {
                            type: "separator"
                        },
                        {
                            type: "group",
                            "RefId": "RightBottomGroup"
                        }
                      ]
                  },
                    {
                        type: "separator"
                    },
                                {
                                    type: "group",
                                    "RefId": "BottomGroup"
                                }
                ]
            }
}
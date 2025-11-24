import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const tiers = [
    {
        name: 'Free',
        price: 0,
        description: 'Perfect for trying out Ocean AI.',
        features: [
            '3 Projects',
            'Basic AI Generation',
            'Export to Word',
            'Community Support',
        ],
        cta: 'Get Started',
        mostPopular: false,
    },
    {
        name: 'Pro',
        price: 19,
        description: 'For power users who need more.',
        features: [
            'Unlimited Projects',
            'Advanced AI Models (Gemini 1.5 Pro)',
            'Export to Word & PowerPoint',
            'Interactive Charts & Images',
            'Priority Support',
        ],
        cta: 'Start Free Trial',
        mostPopular: true,
    },
    {
        name: 'Enterprise',
        price: 99,
        description: 'For teams and organizations.',
        features: [
            'Everything in Pro',
            'Team Collaboration',
            'Custom Branding',
            'API Access',
            'Dedicated Account Manager',
        ],
        cta: 'Contact Sales',
        mostPopular: false,
    },
];

export default function Pricing() {
    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
                        Pricing Plans
                    </h2>
                    <p className="mt-4 text-xl text-slate-500 dark:text-slate-400">
                        Choose the plan that fits your needs.
                    </p>
                </div>

                <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                    {tiers.map((tier) => (
                        <div key={tier.name} className={`border rounded-lg shadow-sm divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800 flex flex-col ${tier.mostPopular ? 'border-blue-500 ring-2 ring-blue-500 relative' : 'border-slate-200 dark:border-slate-700'}`}>
                            {tier.mostPopular && (
                                <div className="absolute top-0 right-0 -mt-2 -mr-2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full shadow-sm uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}
                            <div className="p-6">
                                <h2 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">{tier.name}</h2>
                                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{tier.description}</p>
                                <p className="mt-8">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">${tier.price}</span>
                                    <span className="text-base font-medium text-slate-500 dark:text-slate-400">/mo</span>
                                </p>
                                <Link
                                    to="/create"
                                    className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${tier.mostPopular ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600'}`}
                                >
                                    {tier.cta}
                                </Link>
                            </div>
                            <div className="pt-6 pb-8 px-6 flex-1">
                                <h3 className="text-xs font-medium text-slate-900 dark:text-white tracking-wide uppercase">What's included</h3>
                                <ul className="mt-6 space-y-4">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <div className="flex-shrink-0">
                                                <Check className="h-5 w-5 text-green-500" aria-hidden="true" />
                                            </div>
                                            <p className="ml-3 text-sm text-slate-500 dark:text-slate-400">{feature}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

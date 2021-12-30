declare namespace Cypress {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Chainable {
		setSelectionRange(
			start: number,
			end: number,
			options?: Partial<Loggable & Timeoutable>,
		): Chainable<JQuery<HTMLInputElement>>;
	}
}

Cypress.Commands.add(
	'setSelectionRange',
	{ prevSubject: 'element' },
	// @ts-ignore
	(subject: Chainable<JQuery<HTMLInputElement>>, start: number, end: number, userOptions?: any) => {
		let options = {
			$el: subject,
			error: true,
			log: true,
			verify: true,
			...userOptions,
		};

		if (options.log) {
			options._log = Cypress.log({
				$el: options.$el,
				timeout: options.timeout,
				consoleProps() {
					return { 'Applied To': Cypress.dom.getElements(options.$el) };
				},
			});
		}

		const el = options.$el[0];

		if (
			!(
				el.tagName == 'TEXTAREA' ||
				(el.tagName == 'INPUT' &&
					/^(text|search|URL|tel|password|null)$/.test(el.getAttribute('type')))
			)
		) {
			if (!options.error) {
				return;
			}

			throw new Error('setSelectionRange.invalid_element');
		}

		if (options.$el.length && options.$el.length > 1) {
			if (!options.error) {
				return;
			}

			throw new Error('setSelectionRange.multiple_elements');
		}

		el.setSelectionRange(start, end);

		const verifyAssertions = () => {
			// @ts-ignore
			return cy.verifyUpcomingAssertions(options.$el, options, {
				onRetry: verifyAssertions,
			});
		};

		return verifyAssertions();
	},
);

import { isQuerySelector } from 'src/utils';
import { Step } from './Step';

export class ClickStep extends Step {
  constructor(
    private selector: string,
    private wait = 100,
  ) {
    super();
  }

  public async execute(): Promise<void> {
    await this.page.evaluate(
      (selector: string, useEval: boolean) => {
        const element = useEval
          ? eval(selector)
          : (document.querySelector(selector) as HTMLElement);

        if (!element) return;

        element.click();
      },
      this.selector,
      isQuerySelector(this.selector),
    );
  }
}

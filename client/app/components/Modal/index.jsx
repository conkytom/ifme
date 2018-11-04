// @flow
// This looks like the heart of the Modal logic
import React from 'react';
// I thought this was a Ruby app, but seems it's a React which I don't have much experience with
import renderHTML from 'react-render-html';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import css from './Modal.scss';
import { I18n } from '../../libs/i18n';

export type Props = {
  element?: any,
  elementId?: string,
  body: any,
  title?: string,
  openListener?: Function,
  open?: boolean,
  // I would think this boolean would be responsible for opening/closing the modal
};

export type State = {
  open: boolean,
  // or maybe this one has more influence
};

export class Modal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { open: !!props.open };
    // looks like they are connected together here?
  }

  displayContent = (content: any) => {
    if (typeof content === 'string') {
      return renderHTML(content);
    }
    return content;
  };

  displayModalHeader = () => {
    const { title } = this.props;
    return (
      <div className={css.modalBoxHeader}>
        {title ? (
          <div
            id="modalTitle"
            className={css.modalBoxHeaderTitle}
            aria-label={title}
          >
            {title}
          </div>
        ) : null}
        <div
          className={`modalClose ${css.modalBoxHeaderClose}`}
          onClick={this.toggleOpen}
          onKeyDown={this.toggleOpen}
          role="button"
          tabIndex={0}
          aria-label={I18n.t('close')}
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </div>
    );
  };

  displayModalBody = () => {
    const { body } = this.props;
    return (
      <div id="modalDesc" className={css.modalBoxBody}>
        {this.displayContent(body)}
      </div>
    );
  };

  displayModalBox = () => (
    <div className={`modalBackdrop ${css.modalBackdrop}`}>
      <div
        className={`modal ${css.modalBox}`}
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDesc"
      >
        {this.displayModalHeader()}
        {this.displayModalBody()}
      </div>
    </div>
  );

  toggleOpen = () => {
    // Think it's a midleading title, it changes the state
    // This fires to both open and close the modal
    console.log('toggleOpen');
    const { open } = this.state;
    const { openListener } = this.props;
    const body = ((document.body: any): HTMLBodyElement);
    if (!open) {
      body.classList.add('bodyModalOpen');
      // adds CSS to prevent background from scrolling
    } else {
      body.classList.remove('bodyModalOpen');      
    }
    if (!open && openListener) {
    console.log('toggleOpen\'s openlistener triggered');
      openListener();
    }
    // I don't get what openListner does, but without it the model doesn't open properly
    this.setState({ open: !open });
    console.log('setState changed');
  };

  render() {
    const { element, elementId } = this.props;
    const { open } = this.state;
    return (
      <div>
        {element ? (
          <div
            id={elementId || null}
            className={`modalElement ${css.modalElement}`}
            onClick={this.toggleOpen}
            onKeyDown={this.toggleOpen}
            // onRequestClose={this.toggleOpen}
            // Adding onRequestClose causes an error: "Unknown event handler property `onRequestClose`. It will be ignored."
            // Don't know why, it's my understanding that adding this adds
            // a function to pressing the escape key
            role="button"
            tabIndex={0}
          >
            {this.displayContent(element)}
          </div>
        ) : null}
        {open ? this.displayModalBox() : null}
      </div>
    );
  }
}

// This is in a condition where if the user opens a modal like the notifications
// pressing any key will close the modal IF they have not clicked on the modal
// pressing escape again will also reopen the modal

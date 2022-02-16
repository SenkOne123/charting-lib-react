import React from 'react';
import '../../css/ui-input.css'

class UiInput extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <input
                {...this.props}
                className={`ui-input ${this.props.className}`}
            />
        )
    }
}

export default UiInput;
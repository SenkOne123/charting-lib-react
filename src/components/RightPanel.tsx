import React from 'react'
import UiInput from "./ui/UiInput";
import '../css/right-panel.css'
import exclamation_mark from '../images/exclamation_mark.png'

class RightPanel extends React.Component<any, any>{

    render() {
        return (
            <div className='container'>
                <div className='btn-group'>
                    <div className='btn-group__tab-container'>
                        <p className='btn-group__selected '>Limit</p>
                        <p className='text'>Market</p>
                    </div>
                    <img className='btn-group__image' src={exclamation_mark} alt='exclamation_mark'/>
                </div>
                <div className='btn-group__line'/>
                <div className='price-box'>
                    <div className='price-box__cost-label'>
                        <p className='text'>Avbl</p>
                        <p className='right-panel__white-text'>20.00 USDT</p>
                    </div>
                    <div>
                        <UiInput placeholder='Stop Price' className='price-box__inputs'/>
                        <UiInput placeholder='Price' className='price-box__inputs'/>
                        <UiInput placeholder='Size' className='price-box__inputs'/>
                    </div>
                </div>
                <div className='btn-group__line'/>
                <div className='long-short'>
                    <input className='long-short__checkbox' type='checkbox'/>
                    <p className='right-panel__white-text'>Long/Short</p>
                </div>
                <div className='long-short__btn-group'>
                    <button className='long-short__btn-group--buttons'>5/2</button>
                    <button className='long-short__btn-group--buttons'>7/2</button>
                    <button className='long-short__btn-group--buttons'>6/3</button>
                    <button className='long-short__btn-group--buttons_selected'>9/3</button>
                    <button className='long-short__btn-group--buttons'>8/4</button>
                    <button className='long-short__btn-group--buttons'>12/4</button>
                </div>
                <div className='long-short__input-area'>
                    <UiInput className='long-short__input-area--inputs' placeholder='Take Profit'/>
                    <UiInput className='long-short__input-area--inputs long-short__inputs--gap' placeholder='Stop Loss'/>
                </div>
                <div className='submit-zone'>
                    <button className='submit-zone__green-button'>Buy/Long</button>
                    <button className='submit-zone__red-button'>Sell/Short</button>
                </div>
                <div className='buy-sell-info'>
                    <div className='buy-sell-info__buy'>
                        <div className='flex'>
                            <p className='buy-sell-info__cost-max-text'>Cost</p>
                            <p className='buy-sell-info__usdt-text'>0.00 USDT</p>
                        </div>
                        <div className='flex'>
                            <p className='buy-sell-info__cost-max-text'>Max</p>
                            <p className='buy-sell-info__usdt-text'>2488.30 USDT</p>
                        </div>
                    </div>
                    <div className='buy-sell-info__sell'>
                        <div className='flex'>
                            <p className='buy-sell-info__cost-max-text'>Cost</p>
                            <p className='buy-sell-info__usdt-text'>0.00 USDT</p>
                        </div>
                        <div className='flex'>
                            <p className='buy-sell-info__cost-max-text'>Max</p>
                            <p className='buy-sell-info__usdt-text'>2148.99 USDT</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default RightPanel
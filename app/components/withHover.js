import React from 'react'

export default function withHover(Component,propName = 'hovering'){

    return class withHover extends React.Component{
        constructor(props){
            super(props)
            this.state = {
                hovering:false
            }
    
            this.mouseOut = this.mouseOut.bind(this);
            this.mouseOver = this.mouseOver.bind(this)
    
        }
    
        mouseOver(){
            this.setState({
                hovering:true
            })
        }
        mouseOut(){
            this.setState({
                hovering:false
            })
        }
    
        render(){
            const props = {
                [propName]:this.state.hovering,
                ...this.props
            }
            return(
                <div onMouseOver={this.mouseOver} 
                onMouseOut={this.mouseOut}>
                    <Component {...props}/>
                </div>
            )
        }
    }
}
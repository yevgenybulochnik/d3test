import React from 'react';
import { Subtract } from 'utility-types';

interface InjectedProps {
  height: number;
  width: number;
}

interface Props {
  className?: string;
}

interface State {
  containerHeight: number;
  containerWidth: number;
}

const responsiveChart = <P extends InjectedProps>(Component: React.ComponentType<P>) =>
  class ResponsiveChart extends React.Component<Subtract<P, InjectedProps> & Props, State> {
    container: React.RefObject<HTMLDivElement> = React.createRef()

    state: State = {
      containerHeight: 0,
      containerWidth: 0
    }

    componentDidMount() {
      this.fitToContainer()
      let resizedFn: any
      window.addEventListener('resize', () => {
        clearTimeout(resizedFn)
        resizedFn = setTimeout(() => {
          this.fitToContainer()
        }, 200)
      })
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.fitToContainer)
    }

    fitToContainer = () => {
      if (this.container.current) {
        const h = this.container.current.clientHeight
        const w = this.container.current.clientWidth
        this.setState({
          containerHeight: h,
          containerWidth: w
        })
      }
    }

    renderChart = () => {
      const { containerHeight, containerWidth } = this.state
      const { className, ...props } = this.props

      return (
        <Component height={containerHeight} width={containerWidth} {...props as unknown as P}/>
      )
    }

    render() {
      const { containerHeight, containerWidth } = this.state
      const { className } = this.props
      return (
        <div className={className} ref={this.container}>
          {containerHeight && containerWidth && this.renderChart()}
        </div>
      )
    }
  }

export default responsiveChart

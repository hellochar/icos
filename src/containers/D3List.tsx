import * as React from "react";

import * as d3 from "d3";
import * as _ from "lodash";
// import * as Infinite from "react-infinite";
var Infinite = require("react-infinite");


// export interface ListViewState {


export interface D3ListProps extends React.Props<D3List> {
    data: Array<{ id: string, text: string }>

    addGestalt: () => void
    updateGestalt: (id:string,text:string) => void
}


export default class D3List extends React.Component<D3ListProps, undefined> {
    mountPoint: HTMLElement


    constructor(props) {

        super(props);

        //    this.state = initState

    }

    componentDidMount() {

        const d3MountPoint = d3.select(this.mountPoint)

        d3MountPoint.select("#append").on("click", () => {
            this.props.addGestalt()
        })

        this.updateData(this.props)


        // update()

        //     .data([4, 8, 15, 16, 23, 42])
        // // .text(function (d) { return d; });

        // p.data([1])

        // // Enter…
        // p.enter().append("p")
        //     .text(function (d) { return d; }).style("border:1px solid black");
        // // Exit…
        // p.exit().remove();


    }


    componentWillReceiveProps(nextProps: D3ListProps) {
        this.updateData(nextProps)
    }


    updateData = (props: D3ListProps) => {
        const d3MountPoint = d3.select(this.mountPoint)


        let sel = d3MountPoint.select("#list").selectAll("li")


        let datSel = sel.data(props.data
        , function (d: { id: string, text: string }) {
            if (!d) { throw Error("shouldn't be any preexisting elements") }
            return d.id

            // if(!d) { console.error("asdf")}
            // // if(d) { console.log(d)}
            // return d ? d.id : (this as any).id 
        }
        ).text((d) => d.text)
        console.log('Number of updated datapoints', datSel.size())

        // .style("border", "1px solid black")

        const parentReactComponent = this

        let enterSel = datSel.enter()
        console.log('Number of inserted datapoints', enterSel.size())

        enterSel.append("li").text((d) => d.text)
            .style("width", "200px")
            .style("border", "1px solid black")

            .on("click", function (d) {
                // debugger
                // d3.event.currentTarget 
                (this as any).style = "border:1px solid red";
                (this as any).contentEditable = true;
            })
            .on("keydown", function (d) {
                parentReactComponent.props.updateGestalt(d.id,(this as any).innerText)
                // debugger
                // // d3.event.currentTarget 
                // (this as any).style = "border:1px solid black";
                // (this as any).contentEditable = false;
            })
        // .style("border", "1px solid red")

        let exitSel = datSel.exit()
        exitSel.remove()


    }




    render() {

        // <ul id="list">
        //     <Infinite containerHeight={400} elementHeight={20}>
        //         <li height="20">uu</li>
        //     </Infinite>
        // </ul>


        return (<div >
            Titleasd faadsfa
            < div ref={mountPoint => this.mountPoint = mountPoint} >
                <button id="append">Append</button>
                <ul id="list">
                </ul>

            </div >


        </div >)


    }
}

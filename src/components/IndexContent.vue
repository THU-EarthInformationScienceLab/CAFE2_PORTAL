<template>
  <div>
    <section>
      <h1>
        Introduction
      </h1>
      <div class="section-content">
        <div class="float-right-content">
          <img src="../assets/figure2.jpg" />
          <p>
            Figure 1. Time series of ice thickness anomalies in four seasons for
            the period 1910-2010. (Produced by CAFE).
          </p>
        </div>
        <p>
          Figure 1. Time series of ice thickness anomalies in four seasons for
          the period 1910-2010. (Produced by CAFE).Environmental science study
          has experienced considerable revolutions in recent years due to
          significant advances in high performance computing, storage and
          networking technologies. To assist scientists to work efﬁciently with
          distributed datasets, and to allow them to focus their efforts on
          their research rather than prepare data and write repetitive analytic
          scripts, we propose Collaborative Analysis Framework for Environmental
          data (CAFE), a Java-based distributed framework.We provide a
          server-side package to be installed on each data node and a web user
          interface package configured for accessing of end users. Multiple data
          nodes could collaborate with each other to fulfil concurrent
          multi-node data analysis work. Scientists can discover their
          interested data, submit analytic tasks and retrieve analysis results
          from the web user interface.CAFE aims to make scientists easily
          discover and analyze distributed data from multiple sources as if they
          are using data stored in a local centralized archive and provide
          extensible solutions for analytic method sharing.
        </p>

      </div>
    </section>
    <section>
      <h1>Architecture</h1>
      <div class="section-content">
        <div class="float-left-content">
          <img src="../assets/figure1.jpg" />
        </div>
        <p>
          CAFE is supposed to enable efficient data query and large scale
          collaborative analysis of environmental data. To fulfil this design
          goal, CAFE is designed to mainly include four parts: data index
          module, task managing module, data analysis module and Web-based user
          interface. Besides, there is a central server used for the management
          of global nodes and data.
        </p>
        <p>
          All the nodes absorbed in CAFE network are peer to peer and united by
          common protocols and interfaces. CAFE consists of a server-side
          package and a web user interface package. The server-side package
          integrates index module, task managing module and data analysis
          module, and will be installed at each node. The web user interface
          package includes the web user interface and related services, can be
          configured at any web server.
        </p>
      </div>
    </section>
    <section>
      <h1>Workflow</h1>
      <div class="section-content">
        <div class="float-right-content">
          <img src="../assets/figure3.jpg" />
          <p>Figure 3. Sketch map of CAFE workflow.</p>
        </div>
        <p>
          A typical scientific data analysis workflow in CAFE consists of the
          following steps:
        </p>
        <p>
          1) the user selects datasets and analytic function and submit the
          analysis task through the Web-based user interface;
        </p>
        <p>
          2) the task managing module parses the task and decomposes it into
          several sub-tasks, where one dataset corresponds to one sub-task;
        </p>
        <p>
          3) all the sub-tasks are dispatched to the nodes where the datasets are
          stored;
        </p>
        <p>
          4) all the sub-tasks are fulfilled by invoking the corresponding
          analytic functions locally;
        </p>
        <p>
          5) after all the sub-tasks are finished, the task managing module
          collects the results and sends compiled analysis results back to the
          user through the Web-based user interface;
        </p>
        <p>6) the user can download the analysis results in the last step.</p>

      </div>
    </section>
    <section>
      <h1>Web user interface</h1>
      <div class="section-content">
        <div class="float-right-content">
          <img src="../assets/figure4.jpg" />
          <p>Figure 4. Schematic diagram of web user interface.</p>
        </div>
        <p>
          The web-based user interface provides a user-friendly way for
          researchers to query and analyze environmental data through the web
          browser.It mainly includes six parts, respectively are initialization,
          search, task submission, task list checking, task detail checking and
          results retrieval. If a user wants to use analytic functions in CAFE he
          has to register an account first, and then log in. The user can filter
          the dataset by specifying institute, project, frequency, etc. After
          selecting desired datasets to the list, the application will send a
          request to the node and obtain the information of available analytic
          functions. The user can choose the analytic function, set the
          corresponding parameters and submit a task.
        </p>
        <p>
          When the user submits the task form, the information of seleted analytic
          function will be queried and used to validate input parameters. The
          application regularly sends requests to the node to retrieve real-time
          status of tasks by APIs. Asynchronous refreshing is utilized to show
          real-time status of each task. The user can compare the results of
          different sub-tasks from the task detail page and download different
          kinds of results. The web page will demonstrate the graphs or the charts
          of the results and provide download links of multi-format result files.
        </p>

      </div>
    </section>
    <section>
      <h1>Software Availability & Copyright</h1>
      <div class="section-content">
        <div class="float-right-content">
          <img src="../assets/figure5.jpg" />
          <p>
            Figure 5. EOF analysis for the period 1900-1999.(Produced by CAFE)
          </p>
        </div>
        <p>
          TO get the full software package,please access
          <a
                  href="https://github.com/THU-EarthInformationScienceLab/"
                  target="_blank"
          >https://github.com/THU-EarthInformationScienceLab/</a
          >
        </p>
        <p>This document is written by Hao Xu.</p>
        <p>
          The authors of CAFE include Yuqi Bai, Hao Xu, Ke Yan, Chang Xiao, Sha Li
          etc.
        </p>
        <p>If you have any questions about CAFE, please send email to us.</p>
        <p>Email: xuhao13@mails.tsinghua.edu.cn</p>
        <p>
          Address:Center for Earth System Science,Tsinghua
          University,Beijing,China,100086
        </p>
        <p>
          Copyright: Earth Information Science Lab, Center for Earth System
          Science, Tsinghua University
        </p>

      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "IndexContent"
};
</script>

<style scoped lang="scss">
  section {
    margin: 20px 0;
    padding: 20px 0;
    border-bottom: 1px solid #c0c0c0;
    h1 {
      font-size: 20px;
      padding-left: 15px;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 4px;
        height: 20px;
        width: 4px;
        background: rgb(255, 186, 56);
      }
    }
    p {
      text-align: justify;
      color: #2f4152;
    }
  }
  $float-margin-size: 20px;
  .float-left-content {
    float: left;
    margin-right: $float-margin-size;
  }
  .float-right-content {
    float: right;
    margin-left: $float-margin-size;
  }
  .float-left-content , .float-right-content {
    $image-size: 350px;
    width: $image-size;
    img {
      width: $image-size;
    }
    p {
      font-size: 10px;
      color: #2c3e50;
    }
  }
  .section-content {
    clear: both;
  }
</style>

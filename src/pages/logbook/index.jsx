import Layout from "../../components/layout";

export default function LogBook() {
  return (
    <Layout>
      <div class="flex justify-center w-full p-4">
        <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-11/12">
          <table class="table w-full">
            <thead>
              <tr>
                <th class="w-16">#</th>
                <th>Name of Person</th>
                <th>Patient Name</th>
                <th>Work Type</th>
                <th>Time Required</th>
                <th>Has Files</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>1</th>
                <td>Ion Popescu</td>
                <td>Maria Ionescu</td>
                <td>Ecografie</td>
                <td>30 min</td>
                <td>Yes</td>
              </tr>

              <tr>
                <th>2</th>
                <td>Ana Georgescu</td>
                <td>Vasile Păun</td>
                <td>Radiografie</td>
                <td>45 min</td>
                <td>No</td>
              </tr>

              <tr>
                <th>3</th>
                <td>Mihai Dobre</td>
                <td>Elena Vasilescu</td>
                <td>RMN</td>
                <td>60 min</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
